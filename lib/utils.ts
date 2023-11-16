import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import forge from 'node-forge';

const publicKeyPem = `-----BEGIN RSA PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAznSDm8UhlliFKh8NNVhg
TjkWuMv8V3eN53C+fLgdT8CmCnFEtOpqO1/ID/YSjoAxZTgIRIcQ/bTQKaomqS4l
0iz0fYUfNJRK0uVas4Ny3Kq+0KNmUEov26bBNIzxpDSIm3eBqFZAd4a0BOzNA2RT
CebTwvMA8+PCSoM3+u0flbPrszCQUxRUE3cYVkuBhDgKZElm01hXnD9TBqKDl6Hq
DkSFWm4SHbVXYY+VrC/Zk7BZtNinrDSmtFGbs4fw/ZvZKlT6HXzey29IGGvdoUmv
1XKpyib/ZjHysH1YfPAyMyDYxBHMc3VJbObVlM/VrhXJ/4Za7bAjLO961me8Y8j6
EZ5tZoGllDeOg/ttf8Y0LOPKphPmdhFW36QDrxilTlMu4Q9y6OqLUrkIjB2DDu97
mFnjZB4sQtHj9J/G0+/4LICU5ZlLZgFeg32rg2mlSX6S19F2Ma63zCQTAooB4of+
i2Cqv0/8Joa9G0k14n/bbjuV/hagElOwgBK5uG5T7O8Yx6DOBrJ6Et3LlR/nwQPm
3l5v8Wt+LVtBN7EXmzRuQCaDmO+33lQlCEfAJ6qU7vG2XnOVGcD61dM2NTEFZz4n
dMkkSSY0G+zLg2tCQVV/UT22FR2u1zQq3+L0yJItulbkw522cwzlyzz+/2GkkFzu
4ttLi77wN+y4Ds43S/BfrpkCAwEAAQ==
-----END RSA PUBLIC KEY-----
`;

const entitySecretHex = '6dd6b84301122e9df3d33768524fff249f0fe5dccf35f0c201c1d05faa7548c5';

export function generateEntitySecretCipherText() {
  // 将十六进制字符串转换为字节
  const entitySecret = forge.util.hexToBytes(entitySecretHex);

  // 从 PEM 格式转换公钥
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  // 加密实体秘密
  const encryptedData = publicKey.encrypt(entitySecret, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });

  // 将加密数据编码为 Base64 字符串
  const entitySecretCipherText = forge.util.encode64(encryptedData);

  return entitySecretCipherText;
}


// Shadcn UI and for Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reading Time
export function getMinutes(minutes: number) {
  const roundedMinutes = Math.round(minutes);
  return `${roundedMinutes} min`;
}

// Open Graph Images for Twitter and Facebook
export function getOgImageUrl(
  title: string,
  subTitle: string,
  tags: Array<string>,
  slug: string,
) {
  const uri = [
    `?title=${encodeURIComponent(title)}`,
    `&subTitle=${encodeURIComponent(subTitle)}`,
    `${tags.map((tag) => `&tags=${encodeURIComponent(tag)}`).join("")}`,
    `&slug=${encodeURIComponent(slug)}`,
    // Joining a multiline string for readability.
  ].join("");

  return `${getUrl()}/api/og${uri}`;
}

// Convert date to string
export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function getUrl() {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  } else {
    return process.env.NEXT_PUBLIC_WEB_URL || "https://ub.cafe";
  }
}

// BlurData for loading images with blur effect
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#d1d5db" offset="20%" />
      <stop stop-color="#d7dade" offset="50%" />
      <stop stop-color="#d1d5db" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#d1d5db" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}
