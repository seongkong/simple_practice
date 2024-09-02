import React, { useEffect, useState } from "react";
import { deleteUser, getUserData, postUserData } from "./AxiosAPI";
import styled from "styled-components";
import Slick from "./Components/Slick"; // Slick 컴포넌트 임포트

const App = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        setUserData(response.data);
        setFilteredData(response.data); // 초기 데이터 설정
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [newUserData, setNewUserData] = useState(() => initialState);

  const handlePostData = async () => {
    try {
      const response = await postUserData(newUserData);
      const userDataset = await getUserData();
      setUserData(userDataset.data);
      setFilteredData(userDataset.data); // 데이터 추가 후 필터 데이터 갱신
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteData = async (id) => {
    try {
      const response = await deleteUser(id);
      const userDataset = await getUserData();
      setUserData(userDataset.data);
      setFilteredData(userDataset.data); // 데이터 삭제 후 필터 데이터 갱신
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = userData.filter((data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // 현재 페이지에 표시할 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 스크롤에 따라 흐려지는 효과
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 200; // 최대 스크롤 값
      const blur = Math.min(scrollTop / maxScroll, 1) * 10; // 최대 blur 값 10
      setBlurAmount(blur);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <DivContainer>
      <BlurOverlay blur={blurAmount} />
      <SlickContainer>
        <Slick /> {/* Slick 컴포넌트 추가 */}
      </SlickContainer>
      <PageTitle>User Data 가져오기</PageTitle>
      <SearchContainer onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name"
        />
        <button type="submit">확인</button>
      </SearchContainer>
      <UserDataTable userData={currentItems} handleDeleteData={handleDeleteData} />
      <UserDataForm
        newUserData={newUserData}
        handleInputChange={handleInputChange}
        handlePostData={handlePostData}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </DivContainer>
  );
};

const initialState = {
  id: null,
  name: "",
  age: null,
  part: "",
  image: "",
};

const UserDataForm = ({ newUserData, handleInputChange, handlePostData }) => (
  <div style={{ textAlign: "center" }}>
    <h1>데이터 추가하기</h1>
    <table width="500px" border="1px solid black">
      <tbody>
        <tr>
          <td width="40%">id:</td>
          <td width="60%">
            <input
              type="number"
              name="id"
              value={newUserData.id || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
        <tr>
          <td width="40%">name:</td>
          <td width="60%">
            <input
              type="text"
              name="name"
              value={newUserData.name || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
        <tr>
          <td width="40%">age:</td>
          <td width="60%">
            <input
              type="number"
              name="age"
              value={newUserData.age || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
        <tr>
          <td width="40%">part:</td>
          <td width="60%">
            <input
              type="text"
              name="part"
              value={newUserData.part || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
        <tr>
          <td width="40%">image:</td>
          <td width="60%">
            <input
              type="text"
              name="image"
              value={newUserData.image || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <UpdateButton onClick={handlePostData}>Update Data</UpdateButton>
  </div>
);

const UserDataTable = ({ userData, handleDeleteData }) => (
  <table border="1px solid black" width="500px">
    <thead>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>age</th>
        <th>part</th>
        <th>image</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {userData.map((data, index) => (
        <tr key={index}>
          <td>{data.id}</td>
          <td>{data.name}</td>
          <td>{data.age}</td>
          <td>{data.part}</td>
          <td>
            <ImageWrapper>
              <img src={data.image} alt={`User ${data.id} image`} />
            </ImageWrapper>
          </td>
          <td>
            <DeleteButton onClick={() => handleDeleteData(data.id)}>
              Delete
            </DeleteButton>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = ({ currentPage, totalPages, handlePageChange }) => (
  <PaginationContainer>
    {Array.from({ length: totalPages }, (_, index) => (
      <PaginationButton
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        active={currentPage === index + 1}
      >
        {index + 1}
      </PaginationButton>
    ))}
  </PaginationContainer>
);

const DivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  & > table {
    text-align: center;
  }
`;

const SlickContainer = styled.div`
  width: 1440px;
  height: 758px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  width: 1440px;
  height: 758px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(${(props) => props.blur}px);
  pointer-events: none;
`;

const PageTitle = styled.p`
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0px;
`;

const UpdateButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #ff5858;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: ${(props) => (props.active ? "#007bff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  border: 1px solid #007bff;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 5px;
`;

const SearchContainer = styled.form`
  margin-bottom: 20px;
  input {
    padding: 10px;
    font-size: 16px;
    width: 300px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
  }
`;

export default App;
