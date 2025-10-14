export const phoneNumberRegex = /^[6-9]\d{9}$/
export const aadharNumberRegex = /^\d{12}$/
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
export const timeStampRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (A\.M\.|P\.M\.)$/
export const timeStampRegexWithoutSpace = /^(0[1-9]|1[0-2]):[0-5][0-9](A\.M\.|P\.M\.)$/
export const timeStamp = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
export const otpRegex = /^\d{6}$/
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
export const nameRegex = /^[a-zA-Z\s]+$/
export const alphanumericRegex = /^[a-zA-Z0-9]+$/
export const alphanumericWithSpaceRegex = /^[a-zA-Z0-9\s]+$/
export const numericRegex = /^[0-9]+$/
export const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
export const ipAddressRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const phoneNumberWithCountryCodeRegex = /^\+\d{1,3}\s?\d{10}$/
export const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/
