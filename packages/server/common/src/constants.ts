export const SUPPORTED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS'
] as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'text/plain',
  'X-Powered-By': 'ARUS'
} as const;