export function setCookie(cookieName: string, cookieValue: string) {
  const farFutureDate = new Date();
  farFutureDate.setFullYear(farFutureDate.getFullYear() + 100); // Set expiry date 100 years from now
  const expires = "expires=" + farFutureDate.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
