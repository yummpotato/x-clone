import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { AttachFileButton, AttachFileInput, Form, SubmitButton } from "./post-tweet-form";

const Wrapper = styled.div`
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 3fr 2fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    background-color: rgba(30, 30, 30, 1);
`;
const Column = styled.div`
    margin: 5px;
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;
const Photo = styled.img`
    width: 100%;
    height: auto;
    border-radius: 15px;
`;

const EditButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
`;
const DelButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    margin-top: 10px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    font-family: sans-serif;
    background-color: black;
    width: 100%;
    resize: none;
    white-space: pre-wrap;
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

export default function Tweet({username, photo, tweet, userId, id}: ITweet) {
    // 로그인한 userId와 포스팅한 userId가 일치해야만 게시글 삭제 가능
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweet);
    const [newFile, setNewFile] = useState<File|null>(null); //typeScript 구문

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewTweet(e.target.value);
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1) {
            setNewFile(files[0]);
        }

        // file의 size가 1mb 미만일 때만 업로드 가능
        const selectedFile = files![0];
        if (selectedFile.size <= 1024 * 1024) { // 1MB = 1024 * 1024 bytes
            setNewFile(selectedFile);
        } else {
            alert("File size exceeds 1MB. Please choose a smaller file.");
            setNewFile(null);
        }
    }

    const onEdit = async () => {
        if (user?.uid !== userId) return;
        setIsEditing(true);
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.uid !== userId) return;
        try {
            if (newFile) {
                const locationRef = ref(storage, `tweets/${user.uid}-${id}`);
                const result = await uploadBytes(locationRef, newFile);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc(db, "tweets", id), {
                    tweet: newTweet,
                    photo: url,
                });
            } else {
                await updateDoc(doc(db, "tweets", id), {
                    tweet: newTweet,
                });
            }
            setIsEditing(false);
        } catch (e) {
            console.log(e);
        }
    };

    const onDelete = async() => {
        const ok = confirm("정말로 삭제하시겠습니까?");
        if(!ok || user?.uid !== userId) return;
        try {
            // document 삭제
            await deleteDoc(doc(db, "tweets", id));

            // 사진이 있다면 사진도 삭제
            if(photo) {
                // 사진이 있을 경우, 해당 사진에 대한 참조를 받아야 함.
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {

        }
    }

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {isEditing ? (
                    <Column className="modify">
                        <Form onSubmit={onSave}>
                            <TextArea rows={3} maxLength={10} onChange={onChange} value={newTweet} required/>
                            <AttachFileButton htmlFor="file">Edit Photo📸</AttachFileButton> 
                            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*"/>
                            <SubmitButton type="submit" value="Edit Tweet"/>
                        </Form>
                    </Column>
                ) : (
                    <>
                        <Payload>{tweet}</Payload>
                        <Column>
                            {user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton> : null}
                            {user?.uid === userId ? <DelButton onClick={onDelete}>Delete</DelButton> : null}
                        </Column>
                    </>
                )}
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo} />
                </Column>
            ) : null}
        </Wrapper>
    );
}