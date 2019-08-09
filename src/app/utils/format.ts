import { Singer } from "../service/data-modals/common.models";

export function formatSinger(singer: Singer[]): Singer[] {
  let ret = [];
  // console.log('singer :', singer);
  singer.forEach((s) => {
    ret.push({
      id: s.id,
      name: s.name
    })
  })
  return ret;
}