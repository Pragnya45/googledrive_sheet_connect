export default async function IDGenerater(lastIdNumber, subString) {
  const paddedID = lastIdNumber.toString().padStart(4, "0");
  return `${subString}${paddedID}`;
}
