import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

        // file의 size가 1mb 미만일 때만 업로드 가능
        const selectedFile = files![0];
        if (selectedFile.size <= 1024 * 1024) { // 1MB = 1024 * 1024 bytes
            setFile(selectedFile);
        } else {
            alert("File size exceeds 1MB. Please choose a smaller file.");
            setFile(null);
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
            const doc = await addDoc(collection(db, "tweets"), {
                // 넣고 싶은 data를 이곳에 쓰면 된다.
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous", 
                userId: user.uid,
            });

            if(file) {
                // 업로드된 파일이 저장되는 폴더명과 파일명을 지정할 수 있음.
                const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
                // 파일을 어디에 저장하고 싶은지 알려주는 함수
                const result = await uploadBytes(locationRef, file); 
                // result의 public URL을 return하는 함수 (upload한 사진의 url)
                const url = await getDownloadURL(result.ref);
                // 만든 document를 update하는 함수 (doc 변수에 사진 URL을 저장하기 위해서)
                // update할 document에 대한 참조와 update할 data 필요
                await updateDoc(doc, { 
                    photo: url,
                });
            }
            setTweet("");
            setFile(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    return(
        <Form onSubmit={onSubmit}>
            <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="무슨 일이 일어나고 있나요?" required/>

            {/* htmlFor를 AttachFileInput의 id로 설정했기에 AttachFileButton을 클릭해도 AttachFileInput의 기능을 한다. */}
            <AttachFileButton htmlFor="file">{file? "Photo Added✅" : "Add Photo📸"}</AttachFileButton> 
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*"/>
            <SubmitButton type="submit" value={isLoading? "Posting..." : "Post Tweet"}/>
        </Form>
    );
}