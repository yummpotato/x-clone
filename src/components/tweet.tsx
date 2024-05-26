import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 3fr 2fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    background-color: rgba(30, 30, 30, 1);
`;
const Column = styled.div``;
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

export default function Tweet({username, photo, tweet, userId, id}: ITweet) {
    // 로그인한 userId와 포스팅한 userId가 일치해야만 게시글 삭제 가능
    const user = auth.currentUser;

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
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DelButton onClick={onDelete}>Delete</DelButton> : null}
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo}/>
                </Column>
            ) : null}
        </Wrapper>
    );
}