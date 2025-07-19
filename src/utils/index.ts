import { base64url, base64, base58 } from '@scure/base';
import dayjs from 'dayjs';
import BN from 'bignumber.js'

/**
 * COPY Utils
 */

import { useEffect, useState } from 'react';

export type TObject<T> = {
  [key: string]: T
}

export const isNumber = (val: any) => typeof val === 'number'

export const ObjectProto = Object.prototype
export const ObjectToString = ObjectProto.toString
const hasOwnProperty = ObjectProto.hasOwnProperty

export const desensitize = (
  val: string,
  { prePlainLength = 2, postPlainLength = 2, maskLength = 4, maskSymbol = '*' } = {},
) => {
  const reg = new RegExp(`(.{${prePlainLength}})(.*)(.{${postPlainLength}})`)

  return (val || '').replace(reg, (match, before, maskPart, after) => {
    return `${before}${maskLength > 0
      ? maskSymbol.repeat(maskLength)
      : maskPart
        .split('')
        .map(() => maskSymbol)
        .join('')
      }${after}`
  })
}

export const addressShortener = (val: string = '', prePlainLength = 6, postPlainLength = 4): string =>
  desensitize(val, { prePlainLength, postPlainLength, maskLength: 3, maskSymbol: '.' })

export const isObject = (val: any): boolean => {
  return !!val && Object(val) === val
}

export const isObjectLike = (val: any): boolean => !!val && typeof val === 'object'

export const isArray = Array.isArray // IE9+，ES5.1

export const hasOwn = (obj: Record<any, any>, key: string): boolean => hasOwnProperty.call(obj, key)

export const forEach = (obj: any, callback: (item: any, idx: string|number, target: any)=> any) => {
  if (obj == null) return false

  // 将非对象类型转为对象
  if (!isObjectLike(obj)) {
    obj = [obj]
  }

  if (isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      callback.call(null, obj[i], i, obj)
    }
  } else {
    for (const key in obj) {
      if (hasOwn(obj, key)) {
        callback.call(null, obj[key], key, obj)
      }
    }
  }
}

export function merge(target: TObject<any>, ...objs: any[]) {
  function assignValue(val: any, key: any) {
    if (isPlainObject(val)) {
      if (isPlainObject(target[key])) {
        target[key] = merge(target[key], val)
      } else {
        target[key] = merge({}, val)
      }
    } else {
      target[key] = val
    }
  }

  for (let i = 0, l = objs.length; i < l; i++) {
    forEach(objs[i], assignValue)
  }

  return target
}

/**
 * 深克隆类对象
 * - 如果不是类对象则返回自身
 */
export const deepClone = (obj: any): any =>  {
  if (!isObject(obj)) {
    return obj
  }

  if (obj instanceof Array) return obj.map(deepClone)

  const copy: TObject<any> = {}

  Object.getOwnPropertyNames(obj).forEach(prop => {
    copy[prop] = deepClone(obj[prop])
  })

  Object.setPrototypeOf(copy, Object.getPrototypeOf(obj))

  return copy
}

export const isPlainObject = (val: any): boolean => baseTag(val) === '[object Object]'

export const baseTag = (val: any): string => ObjectToString.call(val)

export function useSetState(initValue: any) {
  const [_value, _setValue] = useState(initValue);

  function setValue(newValue: any) {
    // 初始数据为 数组
    if (isArray(initValue)) {
      if (isArray(newValue)) {
        _setValue((oldValue: any) => [...oldValue, ...newValue]);
      } else {
        _setValue((oldValue: any) => [...oldValue, newValue]);
      }
    }
    // 初始数据为 对象
    else if (isPlainObject(initValue)) {
      if (isPlainObject(newValue)) {
        _setValue((oldValue: any) => ({
          ...oldValue,
          ...newValue,
        }));
      } else {
        throw new Error(`${JSON.stringify(newValue)} Does not match the initial data type!`);
      }
    } else if (!isObjectLike(initValue)) {
      _setValue(newValue);
    }
  }
  return [_value, setValue];
}

export const hasWindowSupport = typeof window !== 'undefined'
export const nativeWindow = hasWindowSupport ? window : { sessionStorage: {removeItem: () => {}, clear: () => {}, setItem: () => {}, getItem: () => {}}, localStorage: {removeItem: () => {}, clear: () => {}, setItem: () => {}, getItem: () => {}} }
export const nativeSessionStorage = nativeWindow.sessionStorage
export const nativeLocalStorage = nativeWindow.localStorage
export const nativeJsonStringify = JSON.stringify
export const nativeJsonParse = JSON.parse

export const nativeObjectKeys = Object.keys

export const keys = (val: any) => nativeObjectKeys(Object(val))

function baseArrayEach(arr: Array<any>, iteratee: (item: any, idx: number, arr: Array<any>) => any) {
  const len = arr.length
  let idx = 0

  while (idx < len) {
    if (iteratee(arr[idx], idx++, arr) === false) {
      break
    }
  }

  return arr
}

/**
 * baseStorage
 * @param {Object} storage
 * @return {!Object}
 */
const baseStorage = (storage: TObject<any>): TObject<any> => {
  return {
    /**
     * 写入
     * @param {(Object|string)} key
     * @param {*} val
     */
    set(key: string, val: any) {
      if (typeof key === 'object' && key) {
        const arr = keys(key)
        let val = ''
        let idx = arr.length

        while (idx--) {
          val = nativeJsonStringify(key[arr[idx]])
          // 排除 undefined、null
          if (typeof window !== 'undefined') {
            storage.setItem(arr[idx], val != null ? val : '')
          }
        }
      } else {
        if (typeof window !== 'undefined') {
          storage.setItem(key, nativeJsonStringify(val))
        }
      }
    },

    /**
     * 读取
     * - 需要注意，获取时要 .data 才是最终数据
     * @param {(Object|string)} key
     * @return {*}
     */
    get(key: string) {
      let val = ''

      if (isArray(key)) {
        const result: TObject<any> = {}
        let idx = key.length
        let sub = ''

        while (idx--) {
          sub = key[idx]
          if (typeof window !== 'undefined') {
            val = nativeJsonParse(storage.getItem(sub))
          }

          result[sub] = val != null ? val : ''
        }
        return result
      } else {
        if (typeof window !== 'undefined') {
          val = nativeJsonParse(storage.getItem(key))
        }

        return val != null ? val : ''
      }
    },

    /**
     * 删除指定的 key
     * @param {(Array|string)} key
     */
    remove(key: string) {
      if (Array.isArray(key)) {
        baseArrayEach(key, storage.removeItem)
      } else {
        if (typeof window !== 'undefined') {
          storage.removeItem(key)
        }
      }
    },

    /**
     * 清掉对应 storage 的所有缓存
     */
    clear() {
      if (typeof window !== 'undefined') {
        storage.clear()
      }
    },
  }
}

export const localStorage = baseStorage(nativeLocalStorage)
export const sessionStorage = baseStorage(nativeSessionStorage)

export const zeroizeNPlus = (val: number, length = 2) => {
  return Array(Math.max(length - (val + '').length + 1, 0)).join('0') + val
}

export const nativeDate = Date
const nativeNow = nativeDate.now

export const now = nativeNow

export const formatNumber = (val: string | number) => {
  const list = (val + '').split('.')
  const prefix = list[0].charAt(0) === '-' ? '-' : ''
  let num = prefix ? list[0].slice(1) : list[0]
  let result = ''

  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }

  if (num) {
    result = num + result
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
}

export async function asyncMap(array: Array<any>, mapper: any) {
  return await Promise.all(array.map(mapper))
}

/**
 * 执行无限循环
 * - 会先执行1次
 * - callback 返回 true 则会中断
 */
export async function infiniteLoop(
  callback: (accumulate: number) => Promise<void | boolean>,
  ms: number = 1000,
  infinite: boolean = true,
  loop: number = 10,
  accumulate: number = 0, // 累加计数器的起始索引
): Promise<any> {
  let timer: any
  const clear = await callback(accumulate)

  if (!infinite) {
    loop--
  }

  if (infinite || loop > 0) {
    timer = setTimeout(async () => {
      if (clear !== true) {
        infiniteLoop(callback, ms, infinite, loop, ++accumulate)
      }
    }, ms)
  }

  return {
    cancel: () => {
      clearTimeout(timer)
    },
  }
}

export const sleep = (ms: number): Promise<any> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export const isString = (val: any) => typeof val === 'string'

/**
 * @param {Object} opts
 * @param {boolean=} opts.decode 是否解码
 * @param {boolean=} opts.parseNumbers 如果 value 是数值类型，则解析为数值类型，而不是字符串类型
 * @param {boolean=} opts.parseBooleans 如果 value 是布尔类型，则解析为布尔类型，而不是字符串类型
 */
export const queryUriParse = (query:any, { decode = true, parseNumbers = false, parseBooleans = false } = {}) => {
  // TODO:
  function parseValue(value: any) {
    if (parseNumbers && !Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
      value = Number(value)
    } else if (parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
      value = value.toLowerCase() === 'true'
    }

    return value
  }

  const result: TObject<any> = {}

  if (!isString(query)) return result

  query = query.trim().replace(/^[?#&]/, '')

  if (!query) return result

  for (const param of query.split('&')) {
    if (param === '') continue

    let [key, value] = splitOnFirst(decode ? param.replace(/\+/g, ' ') : param, '=')

    key = decode ? decodeURIComponent(key) : key

    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    value = value === undefined ? null : decode ? decodeURIComponent(value) : value

    if (result[key] === undefined) {
      result[key] = value
    } else {
      result[key] = [].concat(result[key], value)
    }
  }

  for (const key of keys(result)) {
    const value = result[key]
    // TODO:
    if (typeof value === 'object' && value !== null) {
      for (const k of keys(value)) {
        value[k] = parseValue(value[k])
      }
    } else {
      result[key] = parseValue(value)
    }
  }

  return result
}


/**
 * 分割字符
 * - 必须要有一个分割符
 * @see split-on-first
 * @param {*} string
 * @param {*} separator
 * @return {!Array}
 */
export const splitOnFirst = (string: any, separator: any): Array<any> => {
  const result: Array<any> = []

  if (!(isString(string) && isString(separator)) || string === '' || separator === '') return result

  // 是否存在
  const separatorIndex = string.indexOf(separator)

  if (separatorIndex === -1) return result

  return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)]
}


/**
 * 监听事件
 */
export const listenEvent = async ({ contract, name = 'allEvents', transactionHash = '', success = (result) => {} }
  :{ contract: any, name: string, transactionHash: string, success?: (result: any) => any}): Promise<any> => {
  return new Promise((resolve, reject) => {
    contract.events[name]()
      // 接收到新的事件时触发
      .on('data', (data: any) => {
        /* data
          event - String: 事件名称
          signature - String|Null: 事件签名，如果是匿名事件，则为null
          address - String: 事件源地址
          returnValues - Object: 事件返回值，例如 {myVar: 1, myVar2: '0x234...'}.
          logIndex - Number: 事件在块中的索引位置
          transactionIndex - Number: 事件在交易中的索引位置
          transactionHash 32 Bytes - String: 事件所在交易的哈希值
          blockHash 32 Bytes - String: 事件所在块的哈希值，pending的块该值为 null
          blockNumber - Number: 事件所在块的编号，pending的块该值为null
          raw.data - String: 该字段包含未索引的日志参数
          raw.topics - Array: 最多可保存4个32字节长的主题字符串数组。主题1-3 包含事件的索引参数
        */

        const result = {
          event: 'data',
          returnValues: data.returnValues,
        }

        // transactionHash 存在则为过滤条件
        if (
          !(transactionHash
            ? transactionHash === data.transactionHash
            : // 不在范围内则跳过
              true)
        )
          return false

        success(result)

        resolve(result)
        // 当事件从区块链上移除时触发
      })
      .on('changed', (data: any) => {
        resolve({
          event: 'changed',
          returnValues: data.returnValues,
        })
      })
      .on('error', (err: any) => {
        reject({
          event: 'error',
          error: err,
        })
      })
  })
}


export function maskingAddress(address: string): string {
  return address
    ? address.replace(address.substring(5, address.length - 4), '...')
    : ''
}

// 用于 url 的安全 Base58 编码
export const urlSafeBase58Encode = (val: string): string => base58.encode(new TextEncoder().encode(val))

// 用于 url 的安全 Base58 解码
export const urlSafeBase58Decode = (val: string): string => new TextDecoder().decode(base58.decode(val))

export const urlSafeBase58EncodeByJSON = (obj: TObject<any>): string => {
  return urlSafeBase58Encode(JSON.stringify(obj))
}

export const urlSafeBase58DecodeByJSON = (val: string, key: string): string => {
  let result = ''

  if (!val) return result

  try {
    result = JSON.parse(urlSafeBase58Decode(val))[key]
  } catch(e) {
    console.error(e)
  }

  return result
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })
}


export const dealImage = async (base64: string, w: number, quality: number = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const newImage = new Image();
    newImage.src = base64;
    newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
    let imgWidth, imgHeight;

    newImage.onload = () => {
      imgWidth = newImage.width;
      imgHeight = newImage.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (Math.max(imgWidth, imgHeight) > w) {
        if (imgWidth > imgHeight) {
          canvas.width = w;
          canvas.height = w * imgHeight / imgWidth;
        } else {
          canvas.height = w;
          canvas.width = w * imgWidth / imgHeight;
        }
      } else {
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        quality = 0.6;
      }

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(newImage, 0, 0, canvas.width, canvas.height);
      base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
      // // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
      // while (base64.length / 1024 > 150) {
      // 	quality -= 0.01;
      // 	base64 = canvas.toDataURL("image/jpeg", quality);
      // }
      // // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
      // while (base64.length / 1024 < 50) {
      // 	quality += 0.001;
      // 	base64 = canvas.toDataURL("image/jpeg", quality);
      // }

      resolve(base64)
    }
  })
}

export const getNextDayUTC = (): number => {
  const currentDate = new Date();
  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  nextDay.setUTCHours(0, 0, 0, 0);
  return nextDay.getTime();
}

export const getTgShareUrlBy = (data: any) => {
  const url = data.secondShareUrl

  if (!url) return ''

  const tgUrl = new URL(url || '')
  const shareParams = new URLSearchParams(tgUrl.search)

  return `https://t.me/share/url?text=${ shareParams.get('text') }&url=${ shareParams.get('url') }`
}

export const getLineShareUrlBy = (data: any) => {
  const url = data.secondShareUrl

  if (!url) return ''

  const tgUrl = new URL(url || '')
  const shareParams = new URLSearchParams(tgUrl.search)

  return `https://lineit.line.me/share/ui?url=${ encodeURIComponent(shareParams.get('url')) }&text=${ shareParams.get('text') }`
}

export const getShareUrlBy = (data: any) => {
  const url = data.secondShareUrl

  if (!url) return ''

  const tgUrl = new URL(url || '')
  const shareParams = new URLSearchParams(tgUrl.search)

  return shareParams.get('url')
}

export const getWeChatShareBy = (data: any) => {
  const url = data.secondShareUrl

  if (!url) return ''

  const tgUrl = new URL(url || '')
  const shareParams = new URLSearchParams(tgUrl.search)

  return `https://api.qrserver.com/v1/create-qr-code/?size=154x154&data=${ encodeURIComponent(shareParams.get('url')) }`
}
export const getVKShareBy = (data: any) => {
  const url = data.secondShareUrl

  if (!url) return ''

  const tgUrl = new URL(url || '')
  const shareParams = new URLSearchParams(tgUrl.search)

  return `https://vk.com/share.php?url=${ encodeURIComponent(shareParams.get('url')) }`
}

export const toCamelCase = (str: string) => {
  return str
    .split(/[\s-_]+/) // 分割字符串，支持空格、连字符和下划线
    .map((word, index) =>
      index === 0
        ? word.toLowerCase() // 第一个单词小写
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // 其他单词首字母大写
    )
    .join('') // 重新连接成字符串
}

export const toKM = (value, view) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'm';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'k';
    } else {
        return view
    }
}

/**
 * 目标对象弥补缺省值
 * - 浅拷贝
 * - 目标属性为 null、undefined 才弥补
 */
export const defaults = (target: Record<string, any> = {}, defs: Record<string, any> = {}): Record<string, any> => {
  let key: string;

  // 非原型属性
  for (key in defs) {
    if (Object.prototype.hasOwnProperty.call(defs, key)) {
      // 目标属性为 null、undefined
      if (target[key] == null) target[key] = defs[key];
    }
  }

  return target;
}

// 允许输入数字、0.000
export const inputIsNumber = (val: any) => {
  return +val >= 0 && !Number.isNaN(val)
}

export const getDecimalLength = (number) => {
  const decimalPart = number.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}



// 0.9 -> 90 %
// per = true 时，则不再 * 100
// 并优化，如果100,90,等整数时，不会显示100.00,90.00
export const formatPer = (val: number | string, per = false): string => {
  const num = Number(val) * (per ? 1 : 100)

  return Number.isInteger(num) ? num.toString() : num.toFixed(2)
}


export const sortArrayByKey = (array: any[], key: string, ascending: boolean = false): any[] => {
    return array.sort((a, b) => {
        if (new BN(a[key]).lt(b[key])) {
            return ascending ? -1 : 1;
        }
        if (new BN(a[key]).gt(b[key])) {
            return ascending ? 1 : -1;
        }
        return 0;
    });
}

// 返回毫秒
export function getLocalTimezoneOffsetInSeconds() {
  const date = new Date();
  const offsetInMinutes = date.getTimezoneOffset();

  const offsetInSeconds = -offsetInMinutes * 60 * 1000;
  return offsetInSeconds;
}