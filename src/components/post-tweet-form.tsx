import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    font-family: sans-serif;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: sans-serif;
    }
    &:focus,
    &:hover {
        outline: none;
        border: 3px solid #1d9bf0;
    }
`;
const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;
const AttachFileInput = styled.input`
    display: none;
`;
const SubmitButton = styled.input`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:focus,
    &:hover {
        opacity: 0.9;
    }
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File|null>(null); //typeScript 구문

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    }

    // type이 file인 input이 변경될 때마다 file의 배열을 받게 되는 함수
    // 또한, input에서 파일을 추출할 때, 파일이 딱 한 개만 있는지 확인한다. (why? 어떤 input은 복수의 파일을 upload하게 해주기 때문!)
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1) {
            setFile(files[0]);
        }
    }

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        // loading 중인지, tweet이 비었는지, tweet의 길이가 180자보다 많은지 체크
        if(!user || isLoading || tweet === ""  || tweet.length > 180) return; // user가 login되어 있지 않은 상태라면 return;

        try {
            setLoading(true);

            // new document 생성 -> 어떤 collection에 document를 생성하고 싶은지 지정해야 함.
            await addDoc(collection(db, "tweets"), {
                // 넣고 싶은 data를 이곳에 쓰면 된다.
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous", 
                userId: user.uid
            })

            if(tweet !== ""){
                setTweet("");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    return(
        <Form onSubmit={onSubmit}>
            <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="무슨 일이 일어나고 있나요?"/>

            {/* htmlFor를 AttachFileInput의 id로 설정했기에 AttachFileButton을 클릭해도 AttachFileInput의 기능을 한다. */}
            <AttachFileButton htmlFor="file">{file? "Photo Added✅" : "Add Photo📸"}</AttachFileButton> 
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*"/>
            <SubmitButton type="submit" value={isLoading? "Posting..." : "Post Tweet"}/>
        </Form>
    );
}