import { useCallback, useEffect, useState } from 'react';
import { Music } from '../constants';
import e, { EventType } from '../eventemitter';
import useDynamicZIndex from '../use_dynamic_z_index';
import MusicDownloadDialog from './music_download_dialog';

function Wrapper() {
  const zIndex = useDynamicZIndex(EventType.OPEN_MUSIC_DOWNLOAD_DIALOG);
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);
  const [music, setMusic] = useState<Music | null>(null);

  useEffect(() => {
    const unlistenOpen = e.listen(
      EventType.OPEN_MUSIC_DOWNLOAD_DIALOG,
      ({ music: m }) => {
        setMusic(m);
        setOpen(true);
      },
    );
    return unlistenOpen;
  }, []);

  return music ? (
    <MusicDownloadDialog
      open={open}
      onClose={onClose}
      music={music}
      zIndex={zIndex}
    />
  ) : null;
}

export default Wrapper;
