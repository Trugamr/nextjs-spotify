export const stringToBase64 = string => {
  // Create buffer object, specifying utf8 as encoding
  let bufferObj = Buffer.from(string, 'utf8')
  // Encode the Buffer as a base64 string
  return bufferObj.toString('base64')
}