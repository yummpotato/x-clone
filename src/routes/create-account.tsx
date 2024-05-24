import { useState } from "react";
import styled, {keyframes} from "styled-components";
import potatoImage from "/Users/parkhyejeong/Desktop/twitter_clone/twitter/public/potato.png";

// 회전 애니메이션 정의
const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 26.25rem;
    padding: 3.125rem 0rem;
`;
const Logo = styled.img`
    width: 300px;
    height: auto;
    animation: ${rotate} 10s linear infinite; // 애니메이션 추가
`;
const Title = styled.h1`
    font-size: 42px;
`;
const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;
const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    font-family: sans-serif; // 브라우저 기본 폰트로 설정

    // type이 submit이라면 cursor를 pointer로 한다는 코드
    &[type="submit"]{
        cursor: pointer;
        &:hover {
            opacity: 0.8; // 투명도 설정
        }
    }
`;
const Error = styled.span`
    font-weight: 600;
    color: tomato;
`;

export default function CreateAccount() {
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Input에 name을 부여한 이유: input이 변경되었을 때, 어떤 input이 변경되었는지 찾을 수 있기 때문에
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        {/* 이벤트에서 target 추출 */}
        const { target: {name, value} } = e;
        if(name === "name") {
            setName(value);
        } else if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 화면이 새로고침되지 않도록 하는 함수

        try {
            // 계정 생성 & 사용자 프로필 이름 설정 & 홈페이지로 리디렉션 필요
        } catch(e) {
            // 오류 설정 필요
        } finally {
            setLoading(false);
        }
    }

    return <Wrapper>
        <Logo src={potatoImage} alt="Logo" />
        <Title>Log into 밤𝕏감자</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required/> {/* name */} {/* required: 필수로 입력해야 할 때 사용 */}
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/> {/* email */}
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/> {/* password */}
            <Input onChange={onChange} type="submit" value={isLoading ? "Loading..." : "Create Account"}/> {/* login btn */}
        </Form>
        {error != "" ? <Error>{error}</Error> : null}
    </Wrapper>;
}