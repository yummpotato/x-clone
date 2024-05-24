import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Proflie from "./routes/proflie";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";

const router = createBrowserRouter([ //배열을 라우터에 전달
  {
    path: "/",
    element: <Layout />,
    children: [ // Layout의 요소!
      {
        path: "", // "" == "/" -> 그래서 루트 링크에 들어가면 Outlet으로 Home이 렌더링되는 것임!
        element: <Home />,
      },
      {
        path: "profile", // "/profile" -> 이 링크로 접속 시, Outlet으로 Proflie이 렌더링됨!
        element: <Proflie />,
      }
    ]
  },
  { // Layout의 요소가 아님!
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  }
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async() => {
    // firebase를 기다려주는 비동기함수 로직 (firebase가 user를 확인하는 동안!)
    await auth.authStateReady(); // 인증 상태가 준비되었는 지 기다림
    // setTimeout(() => setIsLoading(false), 2000);
    setIsLoading(false)
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen/> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App
