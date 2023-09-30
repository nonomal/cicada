import { createRoot } from 'react-dom/client';
import generateRandomString from '#/utils/generate_random_string';
import { StrictMode } from 'react';
import {
  ID_LENGTH,
  Alert,
  Captcha,
  Confirm,
  Input,
  InputList,
  DialogType,
  MultipleSelect,
  FileSelect,
  TextareaList,
  ImageCut,
} from './constants';
import e, { EventType } from './eventemitter';
import DialogApp from './dialog_app';

const root = document.createElement('div');
root.className = 'dialog-app';
document.body.appendChild(root);
createRoot(root).render(
  <StrictMode>
    <DialogApp />
  </StrictMode>,
);

export default {
  alert: (a: Omit<Alert, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const alert: Alert = {
      ...a,
      type: DialogType.ALERT,
      id,
    };
    e.emit(EventType.OPEN, alert);
    return id;
  },
  confirm: (c: Omit<Confirm, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const confirm: Confirm = {
      ...c,
      type: DialogType.CONFIRM,
      id,
    };
    e.emit(EventType.OPEN, confirm);
    return id;
  },
  captcha: (c: Omit<Captcha, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const captcha: Captcha = {
      ...c,
      type: DialogType.CAPTCHA,
      id,
    };
    e.emit(EventType.OPEN, captcha);
    return id;
  },
  input: (t: Omit<Input, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const input: Input = {
      ...t,
      type: DialogType.INPUT,
      id,
    };
    e.emit(EventType.OPEN, input);
    return id;
  },
  inputList: (tl: Omit<InputList, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const inputList: InputList = {
      ...tl,
      type: DialogType.INPUT_LIST,
      id,
    };
    e.emit(EventType.OPEN, inputList);
    return id;
  },
  multipleSelect: <Value,>(ms: Omit<MultipleSelect<Value>, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const multipleSelect: MultipleSelect<Value> = {
      ...ms,
      type: DialogType.MULTIPLE_SELECT,
      id,
    };
    e.emit(EventType.OPEN, multipleSelect);
    return id;
  },
  fileSelect: (f: Omit<FileSelect, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const fileSelect: FileSelect = {
      ...f,
      type: DialogType.FILE_SELECT,
      id,
    };
    e.emit(EventType.OPEN, fileSelect);
    return id;
  },
  textareaList: (tl: Omit<TextareaList, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const textareaList: TextareaList = {
      ...tl,
      type: DialogType.TEXTAREA_LIST,
      id,
    };
    e.emit(EventType.OPEN, textareaList);
    return id;
  },
  imageCut: (ic: Omit<ImageCut, 'id' | 'type'>) => {
    const id = generateRandomString(ID_LENGTH, false);
    const imageCut: ImageCut = {
      ...ic,
      type: DialogType.IMAGE_CUT,
      id,
    };
    e.emit(EventType.OPEN, imageCut);
    return id;
  },
  close: (id: string) => e.emit(EventType.CLOSE, { id }),
};
