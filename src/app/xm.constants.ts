const _VERSION = '2.0.0';
const _DEBUG_INFO_ENABLED = true;

const _DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const _DEFAULT_AUTH_TOKEN = 'Basic d2ViYXBwOndlYmFwcA==';

const _DEFAULT_LANG = 'en';

/**
 * System event dictionary
 * @type {{XM_REGISTRATION: string; XM_USER_LIST_MODIFICATION: string}}
 * @private
 */
enum _XM_EVENT_LIST  {
  XM_REGISTRATION = 'xmRegistration',
  XM_SUCCESS_AUTH = 'authenticationSuccess',
  XM_UNAUTHORIZED = 'xm.unauthorized',
  XM_CHANGE_LANGUAGE = 'changeLanguage',
  XM_DASHBOARD_LIST_MODIFICATION = 'dashboardListModification',
  XM_USER_LIST_MODIFICATION = 'userListModification',
  XM_FUNCTION_CALL_SUCCESS = 'xm.functionCall.success',
  XM_ENTITY_DETAIL_MODIFICATION = 'xmEntityDetailModification',
  XM_REFRESH_TIMELINE = XM_ENTITY_DETAIL_MODIFICATION,
  XM_ATTACHMENT_LIST_MODIFICATION = 'attachmentListModification',
  XM_ENTITY_LIST_MODIFICATION = 'xmEntityListModification'
};

export const VERSION = _VERSION;
export const DEBUG_INFO_ENABLED = _DEBUG_INFO_ENABLED;

export const DEFAULT_LANG = _DEFAULT_LANG;

export const XM_EVENT_LIST = _XM_EVENT_LIST;

export const DEFAULT_CONTENT_TYPE = _DEFAULT_CONTENT_TYPE;
export const DEFAULT_AUTH_TOKEN = _DEFAULT_AUTH_TOKEN;

// TODO: process.env.SERVER_API_URL as alternative from webpack
export const SERVER_API_URL = '';
