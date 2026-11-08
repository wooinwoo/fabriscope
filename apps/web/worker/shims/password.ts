// Cloudflare Worker용 비밀번호 검증.
// 무료 Worker는 요청당 CPU 10ms 제한이 있어 scrypt 검증(수십 ms)을 돌릴 수 없다.
// 이 배포의 계정은 모두 공개된 데모 비밀번호를 쓰는 가상 계정이므로,
// seed가 만든 scrypt 해시가 있는 계정에 한해 데모 비밀번호 일치 여부로 검증한다.
import { DEMO_PASSWORD } from "../../../api/src/auth/demo-accounts";

const version = "scrypt-v1$";
const dummyHash = "scrypt-v1$dummy-enumeration$";

export async function hashPassword(): Promise<string> {
  throw new Error("Worker 배포에서는 비밀번호를 새로 만들지 않습니다.");
}

export async function verifyPassword(password: string, encodedHash: string) {
  return (
    encodedHash.startsWith(version) &&
    !encodedHash.startsWith(dummyHash) &&
    password === DEMO_PASSWORD
  );
}
