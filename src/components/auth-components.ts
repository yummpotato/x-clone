import styled, {keyframes} from "styled-components";

// 회전 애니메이션 정의
export const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 26.25rem;
    padding: 3.125rem 0rem;
`;
export const Logo = styled.img`
    width: 300px;
    height: auto;
    animation: ${rotate} 10s linear infinite; // 애니메이션 추가
`;
export const Title = styled.h1`
    font-size: 42px;
`;
export const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;
export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    font-family: sans-serif; // 브라우저 기본 폰트로 설정

    // type이 submit이라면 cursor를 pointer로 한다는 코드
    &[type="submit"]{
        background-color: #1d9bf0;
        color: white;
        cursor: pointer;
        &:hover {
            opacity: 0.8; // 투명도 설정
        }
    }
`;
export const Error = styled.span`
    color: tomato;
    margin-top: 10px;
`;
export const Switcher = styled.span`
    margin-top: 20px;
    a {
        color: #1d9bf0;
    }
`;