import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/database";

// tweet data가 어떻게 생겼는지 typeScript로 정의하기
export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]); // Tweet 배열
    useEffect(() => {
        // 사용자가 다른 화면으로 이동하면 이벤트 리스너에 대한 구독을 취소해야 한다. (안그러면 비용 지불,,)
        // 사용자가 이 페이지에 들어와서 Timeline() 컴포넌트가 mount될 때 구독된다.
        // 즉, useEffect의 tear down, cleanup 기능을 사용하는 것!
        let unsubscribe : Unsubscribe | null = null;
        const fetchTweets = async () => {
            // 어떤 tweet을 원하는 지에 대한 쿼리 생성
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"), // tweet이 생성된 날짜의 내림차순으로 쿼리 정렬

                // 전체 트윗들을 불러오지 않고 일부만 불러오기 (페이지네이션 기능)
                limit(25)
            );
    
            // // documents를 가져오기
            // const snapshot = await getDocs(tweetsQuery);
            // // 쿼리에서 반환된 각 document 내부의 data 처리
            // // map: map 내의 함수에서 반환한 항목으로 배열을 만들어 줌.
            // const tweets = snapshot.docs.map((doc) => {
            //     const {tweet, createdAt, userId, username, photo} = doc.data();
            //     return {
            //         tweet, 
            //         createdAt, 
            //         userId, 
            //         username, 
            //         photo,
            //         id: doc.id,
            //     };
            // });
    
            // onSnapshot: 데이터베이스 및 쿼리와 실시간 연결 생성, 해당 쿼리에 새 요소가 생성되거나 요소가 삭제되었거나 update되었을 때 쿼리에 알려줌.
            // document를 한 번만 가져오는 대신, 쿼리에 리스너 추가 & 무언가가 삭제, 편집, 생성되었다는 알림을 받으면 해당 쿼리의 document를 보면서 필요한 데이터 추출
            // & map을 이용해서 데이터를 배열로 만들고 추출 & 트윗 객체를 생성하고 트윗 객체 배열을 tweets 변수에 넣은 다음 저장
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, photo } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id,
                    };
                });
                // 추출한 tweets 저장
                setTweets(tweets);
            });
        };
        fetchTweets();

        // 사용자가 unmount(이 컴포넌트가 안 보일 때)할 때 cleanup 실행 (tear down, cleanup 기능)
        // useEffect는 더 이상 Timeline() 컴포넌트가 사용되지 않을 때 이 함수 호출
        return () => {
            // unsubscribe가 null이 아닐 때 unsubscribe() 호출
            unsubscribe && unsubscribe();
        }
    }, [])
    return (
        <Wrapper>
            {/* {...tweet}: tweet의 나머지 데이터 */}
            {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
        </Wrapper>
    );
}