import { formatDate } from '.';

export const getDocumentFileName = (document) => (document.url ? document.url.replace(/\/$/, '').split('/').pop() : '');
export const compareDocumentSeverity = (docOne, docTwo) => getDocumentSeverity(docOne) - getDocumentSeverity(docTwo);

export const hasProperLink = (document) =>
  document.validation_created === null ||
  document.download_error !== null ||
  document.downloaded === null ||
  document.hash === '';

export const getDocumentDownloadStatus = (document) => {
  if (document.validation_created === null && document.downloaded !== null) {
    return 'Pending Validation';
  }
  const downloadErrorString = getDownloadErrorString(document);
  if (document.validation_created === null && document.downloaded === null) {
    if (downloadErrorString === '0') {
      return 'Failed Download (Connection Error)';
    }
    if (downloadErrorString === '1') {
      return 'Failed Download (SSL Issue)';
    }
    if (downloadErrorString === '2') {
      return 'Failed Download (Character Encoding Issue)';
    }
    if (downloadErrorString === '3') {
      return 'Failed Download (Invalid URL)';
    }
    if (
      ['400', '401', '403', '404', '500', '501', '502', '503', '504', '505', '506', '507', '509', '510'].includes(
        downloadErrorString
      )
    ) {
      return `Failed Download (HTTP Error ${document.download_error})`;
    }
    if (
      ![
        '0',
        '1',
        '2',
        '3',
        '400',
        '401',
        '403',
        '404',
        '500',
        '501',
        '502',
        '503',
        '504',
        '505',
        '506',
        '507',
        '509',
        '510',
      ].includes(downloadErrorString)
    ) {
      return 'Pending Download';
    }
  }
};

export const getDocumentValidationStatus = (document) => {
  const { report } = document;
  const { valid } = report || { valid: null };
  const { error, warning } = report ? report.summary : { error: -1, warning: -1 };

  if (document.report === null) {
    return { value: 'normal', caption: 'N/A' };
  }
  if (valid === true && error === 0 && warning === 0) {
    return { value: 'success', caption: 'Success' };
  }
  if (valid === true && error === 0) {
    return { value: 'warning', caption: 'Warning' };
  }
  if (valid === true) {
    return { value: 'error', caption: 'Error' };
  }
  if (valid === false) {
    return { value: 'critical', caption: 'Critical' };
  }

  return { value: 'normal', caption: 'N/A' };
};

export const getDocumentDatastoreAvailability = (document, fileStatus) => {
  /* see this ticket for full explanation on these availability statuses
  https://trello.com/c/XeovXQrf/232-front-end-indicator-that-file-is-partially-in-ds-for-al-validation */
  const { report, solrize_end, alv_end, alv_start, alv_error } = document;

  if (solrize_end) {
    const formatedDate = formatDate(solrize_end);

    return `${fileStatus === 'critical' && alv_end ? 'Partial' : 'Yes'} - ${formatedDate}`;
  }

  if (
    fileStatus === 'critical' &&
    ((report?.fileType === 'iati-activities' && !alv_start) || alv_error === 'No valid activities')
  ) {
    return 'No';
  }

  if (
    (report?.fileType === 'iati-activities' && fileStatus !== 'critical') ||
    (report?.fileType === 'iati-activities' &&
      fileStatus === 'critical' &&
      !alv_start &&
      report?.iatiVersion !== '' &&
      report?.iatiVersion !== '1*' &&
      checkDocumentHasErrorVersions(['0.6.1', '0.2.1', '0.1.1'], report?.errors)) ||
    (fileStatus === 'critical' && alv_end)
  ) {
    return 'Pending';
  }

  if (document.report?.fileType === 'iati-organisations') {
    return 'N/A';
  }

  return '';
};

const getDocumentSeverity = (document) => {
  const { validation, valid } = document;
  const { error = -1, warning = -1 } = document.report && document.report.summary;

  if (!validation) {
    return 2;
  } else if (valid === true && error === 0 && warning === 0) {
    return 5;
  } else if (valid === true && error === 0) {
    return 4;
  } else if (valid === true) {
    return 3;
  } else if (valid === false) {
    return 1;
  }
  return 2;
};

const getDownloadErrorString = (document) => (document.download_error ? document.download_error.toString() : '');

const checkDocumentHasErrorVersions = (versions, errors) =>
  !!(errors && errors.find((error) => versions.includes(error.identifier))); // TODO: check with Nick if identifier == id
