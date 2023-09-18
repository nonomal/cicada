import { AssetType } from '#/constants';
import { request, Method } from '..';

function uploadAsset(asset: Blob, assetType: AssetType) {
  const form = new FormData();
  form.append('asset', asset);
  form.append('assetType', assetType);
  return request<{
    id: string;
    path: string;
    url: string;
  }>({
    method: Method.POST,
    path: '/form/asset',
    body: form,
    withToken: true,
    timeout: 5 * 60 * 1000,
  });
}

export default uploadAsset;
