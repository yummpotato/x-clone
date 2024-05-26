import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

// tweet data가 어떻게 생겼는지 typeScript로 정의하기
export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]); // Tweet 배열
    const fetchTweets = async() => {
        // 어떤 tweet을 원하는 지에 대한 쿼리 생성
        const tweetsQuery = query(
            collection(db, "tweets"),
            orderBy("createdAt", "desc") // tweet이 생성된 날짜의 내림차순으로 쿼리 정렬
        );

        // documents를 가져오기
        const snapshot = await getDocs(tweetsQuery);
        // 쿼리에서 반환된 각 document 내부의 data 처리
        // map: map 내의 함수에서 반환한 항목으로 배열을 만들어 줌.
        const tweets = snapshot.docs.map((doc) => {
            const {tweet, createdAt, userId, username, photo} = doc.data();
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
    }
    useEffect(() => {
        fetchTweets();
    }, [])
    return (
        <Wrapper>
            {/* {...tweet}: tweet의 나머지 데이터 */}
            {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
        </Wrapper>
    );
}