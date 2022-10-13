import { last } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { getDefaultServicesAPIOptions, SERVICES_URL } from '.';

export const uploadFile = async (file, tmpWorkspaceId) => {
  if (!file) {
    return null;
  }

  const url = `${SERVICES_URL}/pvt/adhoc/upload?sessionId=${tmpWorkspaceId}&filename=${file.name}&guid=${uuidv4()}`;
  const uploadData = new FormData();
  uploadData.append('file', file, file.name);

  const req = await window.fetch(url, { ...getDefaultServicesAPIOptions(), method: 'post', body: uploadData });

  return last(req);
};

export const fetchFileFromURL = async (fileUrl, workspaceID) => {
  if (!fileUrl) return null;

  const url = `${SERVICES_URL}/pvt/adhoc/url?sessionId=${workspaceID}&url=${fileUrl}&guid=${uuidv4()}`;

  const req = await window.fetch(url, {
    ...getDefaultServicesAPIOptions(),
    method: 'post',
    body: JSON.stringify({ url: fileUrl }),
  });

  if (req.status === 200) return 'success';
  if (req.status === 422) {
    const error = await req.json();

    return error.message.includes(fileUrl) ? error.message : `${error.url} - ${error.message}`;
  }
};

export const getTempWorkspaceURL = (workspaceID) => `${SERVICES_URL}/pvt/adhoc/session/?sessionId=${workspaceID}`;
export const fetchTempWorkspace = async (workspaceID) => {
  const url = getTempWorkspaceURL(workspaceID);

  const response = await window.fetch(url, getDefaultServicesAPIOptions());
  if (response.status === 200) {
    const data = await response.json();

    return data;
  }

  return null;
};

const getValidationReportStatus = (dataset) => {
  const { error, warning, critical } = dataset.report.summary;

  if (!dataset.valid || critical) return 'critical';
  if (dataset.valid && error) return 'error';
  if (dataset.valid && warning) return 'warning';

  return 'success';
};

export const getFileStatusClass = (dataset) => {
  if (dataset.report) {
    const status = getValidationReportStatus(dataset);
    return {
      'text-error': status === 'error',
      'text-critical': status === 'critical',
      'text-warning': status === 'warning',
      'text-success': status === 'success',
    };
  }

  return { 'text-default': true };
};

export const getFileValidationStatus = (dataset) => {
  if (dataset.report) {
    const status = getValidationReportStatus(dataset);

    return status
      .split('')
      .map((c, index) => (index === 0 ? c.toUpperCase() : c))
      .join('');
  }

  return null;
};
