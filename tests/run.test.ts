import hotkeys, {
  filter,
  unbind,
  getScope,
  setScope,
  deleteScope,
  isPressed,
  getPressedKeyCodes,
} from '../src/main';

let browser: any;
// let page: any;

// expect().toEqual() ：判断结果是否和预期等价。
// expect().toBeFalsy() ：判断结果是否为假。
// expect().toBeTruthy() ：判断结果是否为真。

const isff = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
// 模拟键盘摁键
// http://output.jsbin.com/awenaq/3
function __triggerKeyboardEvent(el: HTMLElement, keyCode: any, opt?: any) {
  const eventObj = document.createEvent('Events') as any;
  if (eventObj.initEvent) {
    eventObj.initEvent('keydown', true, true);
  }
  if (keyCode) {
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
  }
  if (opt) {
    for (const a in opt) {
      if (Object.prototype.hasOwnProperty.call(opt, a)) {
        eventObj[a] = opt[a];
      }
    }
  }
  // el.dispatchEvent
  //   ? el.dispatchEvent(eventObj)
  //   : el.fireEvent('onkeydown', eventObj);
  el.dispatchEvent(eventObj);
}
function __triggerKeyboardUp(el: HTMLElement, keyCode: any, opt?: any) {
  const eventObj = document.createEvent('Events') as any;
  if (eventObj.initEvent) {
    eventObj.initEvent('keyup', true, true);
  }
  if (keyCode) {
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
  }
  if (opt) {
    for (const a in opt) {
      if (Object.prototype.hasOwnProperty.call(opt, a)) {
        eventObj[a] = opt[a];
      }
    }
  }
  // el.dispatchEvent
  //   ? el.dispatchEvent(eventObj)
  //   : el.fireEvent('onkeyup', eventObj);
  el.dispatchEvent(eventObj);
}
function __triggerKeyboardFocus(el: any, keyCode?: any, opt?: any) {
  const eventObj = document.createEvent('Events') as any;
  if (eventObj.initEvent) {
    eventObj.initEvent('focus', true, true);
  }
  if (keyCode) {
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
  }
  if (opt) {
    for (const a in opt) {
      if (Object.prototype.hasOwnProperty.call(opt, a)) {
        eventObj[a] = opt[a];
      }
    }
  }
  el.dispatchEvent
    ? el.dispatchEvent(eventObj)
    : el.fireEvent('onfocus', eventObj);
}

// beforeAll(async () => {
//   browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//   page = await browser.newPage();
// });

describe('\n   Hotkeys.js Test Case222.\n', () => {
  // test('HTML loader', async () => {
  //   await page.goto(`file://${path.resolve('./test/index.html')}`, {
  //     waitUntil: 'networkidle2',
  //   });
  // }, 10000);

  // test('Test HTML load', async () => {
  //   const title = await page.title();
  //   expect(title).toBe('hotkeys.js');
  //   const text = await page.$eval('#root', (el: any) => el.textContent);
  //   expect(text).toBe('hotkeys');
  //   expect(window.hotkeys).toBeTruthy();
  //   expect(hotkeys(() => {})).toBeUndefined();
  // });

  test('HotKeys getPressedKeyCodes Test Case', async () => {
    let isExecuteFunction = false;
    await hotkeys('command+ctrl+shift+a', (e: any) => {
      isExecuteFunction = true;
      expect(e.metaKey).toBeTruthy();
      expect(e.ctrlKey).toBeTruthy();
      expect(e.shiftKey).toBeTruthy();
      expect(getPressedKeyCodes()).toEqual([16, 17, 65, 91]);
    });
    await __triggerKeyboardEvent(document.body, 65, {
      metaKey: true,
      ctrlKey: true,
      shiftKey: true,
    });
    expect(isExecuteFunction).toBeTruthy();
    await unbind('command+ctrl+shift+a');
  });

  test('HotKeys modifier scope,setScope,getScope,deleteScope Test Case', () => {
    let isExecuteFunction = false;
    __triggerKeyboardFocus(window);
    hotkeys('⌘+d', 'files', (e: any) => {
      isExecuteFunction = true;
      expect(e.keyCode).toBe(68);
      expect(e.metaKey).toBeTruthy();
      deleteScope('files');
    });
    setScope('files');
    __triggerKeyboardEvent(document.body, 68, {
      metaKey: true,
    });
    expect(isExecuteFunction).toBeTruthy();
    expect(getScope()).toBe('all');

    hotkeys('⌘+d', { scope: 'files2' }, (e: any) => {
      isExecuteFunction = false;
      expect(e.keyCode).toBe(68);
      expect(getScope()).toBe('files2');
      expect(e.metaKey).toBeTruthy();
      deleteScope('files2');
    });
    setScope('files2');
    __triggerKeyboardEvent(document.body, 68, {
      metaKey: true,
    });
    expect(isExecuteFunction).toBeFalsy();
    expect(getScope()).toBe('all');

    hotkeys(
      '⌘+d',
      {
        element: document.body,
        scope: 'scope3',
        keyup: true,
        keydown: false,
      },
      (e: any) => {
        isExecuteFunction = false;
        expect(e.keyCode).toBe(68);
        expect(getScope()).toBe('scope3');
        expect(e.metaKey).toBeTruthy();
        deleteScope('scope3');
      }
    );
    setScope('scope3');
    __triggerKeyboardUp(document.body, 68, {
      metaKey: true,
    });
    expect(isExecuteFunction).toBeFalsy();
    expect(getScope()).toBe('all');
  });

  test('Custom splitKey Test Case', async () => {
    let isExecuteFunction = false;
    await hotkeys('ctrl-a', { splitKey: '-' }, (e: any) => {
      isExecuteFunction = true;
      expect(e.ctrlKey).toBeTruthy();
      expect(getPressedKeyCodes()).toEqual([17, 65]);
    });
    await __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    await unbind();
    expect(isExecuteFunction).toBeTruthy();
  });

  test('HotKeys unbind Test Case', async () => {
    let isExecuteFunction = false;
    hotkeys('enter', (e: any) => {
      isExecuteFunction = true;
      expect(e.keyCode).toBe(13);
    });
    await __triggerKeyboardEvent(document.body, 13);
    expect(isExecuteFunction).toBeTruthy();

    expect(unbind()).toBe(undefined);
    expect(unbind('enter')).toBe(undefined);
    expect(unbind('enter12')).toBe(undefined);
  });

  test('HotKeys Special keys Test Case', async () => {
    let isExecuteFunction = false;
    hotkeys('enter', (e: any) => {
      isExecuteFunction = true;
      expect(e.keyCode).toBe(13);
    });
    hotkeys('return', (e: any) => {
      expect(e.keyCode).toBe(13);
    });
    __triggerKeyboardEvent(document.body, 13);
    __triggerKeyboardUp(document.body, 13);
    unbind('return');
    unbind('enter');
    expect(isExecuteFunction).toBeTruthy();

    hotkeys('space', (e: any) => {
      expect(e.keyCode).toBe(32);
    });
    __triggerKeyboardEvent(document.body, 32);
    __triggerKeyboardUp(document.body, 32);
    unbind('space');

    hotkeys('insert,ins', (e: any) => {
      expect(e.keyCode).toBe(45);
    });
    __triggerKeyboardEvent(document.body, 45);
    __triggerKeyboardUp(document.body, 45);
    unbind('insert');
    unbind('ins');

    hotkeys('backspace', (e: any) => {
      expect(e.keyCode).toBe(8);
    });
    __triggerKeyboardEvent(document.body, 8);
    __triggerKeyboardUp(document.body, 8);
    unbind('backspace');

    hotkeys('tab', (e: any) => {
      expect(e.keyCode).toBe(9);
    });
    __triggerKeyboardEvent(document.body, 9);
    __triggerKeyboardUp(document.body, 9);
    unbind('tab');

    hotkeys('clear', (e: any) => {
      expect(e.keyCode).toBe(12);
    });
    __triggerKeyboardEvent(document.body, 12);
    __triggerKeyboardUp(document.body, 12);
    unbind('clear');

    hotkeys(',', (e: any) => {
      expect(e.keyCode).toBe(188);
    });
    __triggerKeyboardEvent(document.body, 188);
    __triggerKeyboardUp(document.body, 188);
    unbind(',');

    hotkeys('.', (e: any) => {
      expect(e.keyCode).toBe(190);
    });
    __triggerKeyboardEvent(document.body, 190);
    __triggerKeyboardUp(document.body, 190);
    unbind('.');

    hotkeys('/', (e: any) => {
      expect(e.keyCode).toBe(191);
    });
    __triggerKeyboardEvent(document.body, 191);
    __triggerKeyboardUp(document.body, 191);
    unbind('/');

    hotkeys('`', (e: any) => {
      expect(e.keyCode).toBe(192);
    });
    __triggerKeyboardEvent(document.body, 192);
    __triggerKeyboardUp(document.body, 192);
    unbind('`');

    hotkeys('-', (e: any) => {
      expect(e.keyCode).toBe(isff ? 173 : 189);
    });
    __triggerKeyboardEvent(document.body, isff ? 173 : 189);
    __triggerKeyboardUp(document.body, isff ? 173 : 189);
    unbind('-');

    hotkeys('=', (e: any) => {
      expect(e.keyCode).toBe(isff ? 61 : 187);
    });
    __triggerKeyboardEvent(document.body, isff ? 61 : 187);
    unbind('=');

    hotkeys(';', (e: any) => {
      expect(e.keyCode).toBe(isff ? 59 : 186);
    });
    __triggerKeyboardEvent(document.body, isff ? 59 : 186);
    unbind(';');

    hotkeys("'".toString(), (e: any) => {
      expect(e.keyCode).toBe(222);
    });
    __triggerKeyboardEvent(document.body, 222);
    unbind("'");

    hotkeys('\\'.toString(), (e: any) => {
      expect(e.keyCode).toBe(220);
    });
    __triggerKeyboardEvent(document.body, 220);
    unbind('\\');

    hotkeys('['.toString(), (e: any) => {
      expect(e.keyCode).toBe(219);
    });
    __triggerKeyboardEvent(document.body, 219);
    unbind('[');

    hotkeys(']'.toString(), (e: any) => {
      expect(e.keyCode).toBe(221);
    });
    __triggerKeyboardEvent(document.body, 221);
    unbind(']');

    hotkeys('left', (e: any) => {
      expect(e.keyCode).toBe(37);
    });
    __triggerKeyboardEvent(document.body, 37);
    unbind('left');

    hotkeys('up', (e: any) => {
      expect(e.keyCode).toBe(38);
    });
    __triggerKeyboardEvent(document.body, 38);
    unbind('up');

    hotkeys('del', (e: any) => {
      expect(e.keyCode).toBe(46);
    });
    hotkeys('delete', (e: any) => {
      expect(e.keyCode).toBe(46);
    });
    __triggerKeyboardEvent(document.body, 46);
    unbind('delete');
    unbind('del');

    hotkeys('home', (e: any) => {
      expect(e.keyCode).toBe(36);
    });
    __triggerKeyboardEvent(document.body, 36);
    unbind('home');

    hotkeys('pageup', (e: any) => {
      expect(e.keyCode).toBe(33);
    });
    __triggerKeyboardEvent(document.body, 33);
    unbind('pageup');

    hotkeys('pagedown', (e: any) => {
      expect(e.keyCode).toBe(34);
    });
    __triggerKeyboardEvent(document.body, 34);
    unbind('pagedown');

    hotkeys('end', (e: any) => {
      expect(e.keyCode).toBe(35);
    });
    __triggerKeyboardEvent(document.body, 35);
    unbind('end');

    hotkeys('right', (e: any) => {
      expect(e.keyCode).toBe(39);
    });
    __triggerKeyboardEvent(document.body, 39);
    unbind('right');

    hotkeys('down', (e: any) => {
      expect(e.keyCode).toBe(40);
    });
    __triggerKeyboardEvent(document.body, 40);
    unbind('down');

    hotkeys('esc', (e: any) => {
      expect(e.keyCode).toBe(27);
    });
    hotkeys('escape', (e: any) => {
      expect(e.keyCode).toBe(27);
    });
    __triggerKeyboardEvent(document.body, 27);
    unbind('esc');
    unbind('escape');

    hotkeys('CapsLock', (e: any) => {
      expect(e.keyCode).toBe(20);
    });
    hotkeys('⇪', (e: any) => {
      expect(e.keyCode).toBe(20);
    });
    __triggerKeyboardEvent(document.body, 20);
    unbind('⇪');
    unbind('CapsLock');
  });

  test('HotKeys Test Case', async () => {
    hotkeys('w', (e: any) => {
      expect(e.keyCode).toBe(87);
    });
    __triggerKeyboardEvent(document.body, 87);
    unbind('w');

    hotkeys('b', (e: any) => {
      expect(e.keyCode).toBe(66);
    });
    __triggerKeyboardEvent(document.body, 66);
    unbind('b');

    await hotkeys('a', async () => {
      await expect(isPressed('a')).toBeTruthy();
      await expect(isPressed('A')).toBeTruthy();
      await expect(isPressed(65)).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65);
    unbind('a');
  });

  test('unbind with method test', () => {
    const callbackA = jest.fn();
    const callbackB = jest.fn();

    hotkeys('shift+a', callbackA);

    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });
    /**
     * https://github.com/jaywcjlove/hotkeys/issues/55
     * 解决三键组合，实现键值比对，
     * 并不是对象比对，此测试用例无法模拟
     */
    expect(callbackA.mock.calls.length).toBe(2);

    unbind('shift+a', callbackA);

    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });

    expect(callbackA.mock.calls.length).toBe(2);

    hotkeys('shift+a', callbackB);

    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });

    expect(callbackB.mock.calls.length).toBe(2);

    unbind('shift+a', callbackB);

    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });

    expect(callbackB.mock.calls.length).toBe(2);
  });

  test('HotKeys Key combination Test Case', async () => {
    hotkeys('⌘+d', (e: any) => {
      expect(e.keyCode).toBe(68);
      expect(e.metaKey).toBeTruthy();
      return false;
    });
    __triggerKeyboardEvent(document.body, 68, {
      metaKey: true,
    });

    hotkeys('alt+d', (e: any) => {
      expect(e.keyCode).toBe(68);
      expect(e.altKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 68, {
      altKey: true,
    });

    hotkeys('shift+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.shiftKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });

    hotkeys('⇧+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.shiftKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });

    hotkeys('⌘+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.metaKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      metaKey: true,
    });
    unbind('⌘+a');

    hotkeys('⌃+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.ctrlKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    unbind('⌃+a');

    hotkeys('⌥+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.altKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      altKey: true,
    });

    hotkeys('ctrl+,,ctrl+d', (e: any) => {
      expect(e.keyCode).toBe(188);
      expect(e.ctrlKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 188, {
      ctrlKey: true,
    });
    unbind('ctrl+,,ctrl+d');

    hotkeys('Ctrl+A', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.ctrlKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    unbind('Ctrl+A');

    hotkeys('CTRL+A', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(e.ctrlKey).toBeTruthy();
    });
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    unbind('CTRL+A');

    hotkeys('⌃+a', (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(getScope()).toBe('all');
    });
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    unbind('⌃+a');
  });

  // const _modifier = { //修饰键
  //   '⇧': 16, shift: 16,
  //   '⌥': 18, alt: 18, option: 18,
  //   '⌃': 17, ctrl: 17, control: 17,
  //   '⌘': isff ? 224 : 91, cmd: isff ? 224 : 91, command: isff ? 224 : 91
  // };

  test('HotKeys modifier key ⌘,cmd,command Test Case', () => {
    __triggerKeyboardEvent(document.body, 65, {
      shiftKey: true,
    });
    unbind('shift+a');
  });

  test('HotKeys modifier key ⌘,cmd,command Test Case', () => {
    // left key
    hotkeys('*', (e: any) => {
      expect(e.keyCode).toBe(isff ? 224 : 91);
    });
    __triggerKeyboardEvent(document.body, isff ? 224 : 91);
    unbind('*');
    // right key
    hotkeys('*', (e: any) => {
      expect(e.keyCode).toBe(isff ? 224 : 93);
    });
    __triggerKeyboardEvent(document.body, isff ? 224 : 93);
    unbind('*');
  });

  test('HotKeys modifier key ⌃,ctrl,control Test Case', async () => {
    hotkeys('*', (e: any) => {
      expect(e.keyCode).toBe(17);
    });
    __triggerKeyboardEvent(document.body, 17);
    unbind('*');
  });

  test('HotKeys modifier key ⌥,alt,option Test Case', async () => {
    hotkeys('*', (e: any) => {
      expect(e.keyCode).toBe(18);
    });
    __triggerKeyboardEvent(document.body, 18);
    unbind('*');
  });

  test('HotKeys modifier key ⇧,shift Test Case', () => {
    hotkeys('*', (e: any) => {
      expect(e.keyCode).toBe(16);
      expect(e.which).toBe(16);
    });
    __triggerKeyboardEvent(document.body, 16);
    unbind('*');
  });

  test('HotKeys modifier scope,setScope,getScope,deleteScope Test Case', () => {
    hotkeys('⌃+a', 'scope2', async (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(getScope()).toBe('scope2');
      deleteScope('scope2');
    });
    setScope('scope2');
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });

    hotkeys('⌃+a', 'scope3', async (e: any) => {
      expect(e.keyCode).toBe(65);
      expect(getScope()).toBe('scope3');
      deleteScope('scope3');
    });
    setScope('scope3');
    __triggerKeyboardEvent(document.body, 65, {
      ctrlKey: true,
    });
    expect(getScope()).toBe('all');
  });

  // test('HotKeys modifier noConflict Test Case', async () => {
  //   const keys = await hotkeys.noConflict(true);
  //   await keys('a', (e: any) => {
  //     expect(e.keyCode).toBe(65);
  //     expect(e.which).toBe(65);
  //   });
  //   await __triggerKeyboardEvent(document.body, 65);
  // });

  test('Event trigger on readOnly input', async () => {
    const input = document.createElement('input');
    input.setAttribute('readOnly', 'true');
    await hotkeys('*', (event: any) => {
      expect(filter.call(null, event)).toBeTruthy();
    });
    await __triggerKeyboardEvent(input, 65);
    await unbind('*');
    input.removeAttribute('readOnly');
    await hotkeys('*', (event: any) => {
      expect(filter.call(null, event)).toBeFalsy();
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
