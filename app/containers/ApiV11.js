import ApiV1 from '../../lib/core-api-client/ApiV1';

export default class ApiV11 extends ApiV1 {
  fetchNodes(onSuccess, onFailure) {
    this.request('/nodes', onSuccess, onFailure);
  }
}
