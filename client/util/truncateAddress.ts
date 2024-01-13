export function truncateAddress(address: string) {
  if (!address) {
    return "";
  }
  if (address.length !== 42) {
    return address;
  }
  const first = address.substring(0, 5);
  const last = address.substring(address.length - 5);
  return first + "..." + last;
}
