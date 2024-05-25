import { useState } from "react";
import potatoImage from "/Users/parkhyejeong/Desktop/twitter-clone/x-clone/public/potato.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Form, Error, Input, Logo, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
    const navigate = useNavigate();
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

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 화면이 새로고침되지 않도록 하는 함수
        setError("");

        if(isLoading || name === "" || email === "" || password === "") return;

        try {
            setLoading(true);

            // 계정 생성 & 사용자 프로필 이름 설정 & 홈페이지로 리디렉션 필요
            // 계정이 생성되면 사용자가 자동으로 로그인됨
            const credentials = await createUserWithEmailAndPassword(auth, email, password); // createUserWithEmailAndPassword: async에서만 사용가능한 함수, 자격 증명 발급 가능
            console.log(credentials.user);

            // 사용자 프로필 update
            await updateProfile(credentials.user, {
                displayName: name,
            });

            // navigate to home
            navigate("/");
        } catch(e) {
            // 오류 설정 필요
            // 자격 증명을 발급받지 못 했을 경우 실행
            // ex, 해당 이메일로 이미 계정이 있거나 비밀번호가 유호하지 않은 경우
            if(e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return <Wrapper>
        <Logo src={potatoImage} alt="Logo" />
        <Title>Join 감자' 𝕏</Title>
        <Form onSubmit={onSubmit}>
            <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required/> {/* name */} {/* required: 필수로 입력해야 할 때 사용 */}
            <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/> {/* email */}
            <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/> {/* password */}
            <Input onChange={onChange} type="submit" value={isLoading ? "Loading..." : "Create Account"}/> {/* login btn */}
        </Form>
        {error != "" ? <Error>{error}</Error> : null}
        <Switcher>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Switcher>
        <GithubButton/>
    </Wrapper>;
}