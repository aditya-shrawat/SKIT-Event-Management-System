import React, { useState } from "react";
import { Input } from "../ui/input";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";

const AddSubAdmins = ({ setSelectedUsersIds }) => {
  const [inputString, setInputString] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsersInfo, setSelectedUsersInfo] = useState([]);

  const searchUsers = async (e) => {
    e.preventDefault();

    const value = e.target.value.trim();
    setInputString(e.target.value);

    if (value === "") {
      setSearchedUsers([]);
      return null;
    }

    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(
        `${BackendURL}/search/global-users?query=${value}`,
        { withCredentials: true }
      );

      setSearchedUsers(response.data.users || []);
      setErrorMsg("");
    } catch (error) {
      console.log("Error in searching users - ", error);
      setErrorMsg("Something went wrong, try again.");
      setSearchedUsers([]);
    }
  };

  const checkIsAlreadySelected = (user) => {
    return selectedUsersInfo.some((u) => u._id === user._id);
  };

  const selectingUsers = (user) => {
    const isAlreadySelected = checkIsAlreadySelected(user);

    if (isAlreadySelected) return;

    setSelectedUsersIds((prev) => [...prev, user._id]);
    setSelectedUsersInfo((prev) => [...prev, user]);
  };

  const removeSelectedUser = (user) => {
    setSelectedUsersInfo((prev) => prev.filter((u) => u._id !== user._id));
    setSelectedUsersIds((prev) => prev.filter((id) => id !== user._id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 grid place-items-center text-sm">
            👥
          </div>
          Assign Sub-Admins
        </h2>
        <p className="mb-6 text-gray-400 text-sm">Choose sub-admins to share event management and moderation duties.</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Sub-Admins
          </label>
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoSearchOutline className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={inputString}
              onChange={searchUsers}
              placeholder="Name, College Id"
              className="py-2 pl-10 pr-4"
            />
          </div>
        </div>

        {/* Selected Users Display */}
        {selectedUsersInfo.length !== 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Sub-Admins ({selectedUsersInfo.length})
            </label>
            <div className="p-2 text-gray-500 border-[1px] border-[#00bebe] rounded-md flex gap-2 flex-wrap max-h-64 overflow-y-auto">
              {selectedUsersInfo?.map((user) => {
                return (
                  <SelectedUserItem
                    key={user._id}
                    user={user}
                    onRemove={removeSelectedUser}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchedUsers.length === 0 && inputString !== "" && !errorMsg && (
          <div className="mt-6 p-2 text-gray-500 border-[1px] border-gray-300 rounded-md">
            No users found
          </div>
        )}

        {/* Search Results */}
        {searchedUsers.length > 0 && (
          <div className="flex flex-col p-2 mt-4 max-h-64 overflow-y-auto border-[1px] border-gray-300 rounded-md">
            {searchedUsers?.map((user) => {
              return (
                <UserItem
                  key={user._id}
                  user={user}
                  selectingUsers={selectingUsers}
                  checkIsAlreadySelected={checkIsAlreadySelected}
                />
              );
            })}
          </div>
        )}

        {/* Error Message */}
        {errorMsg.trim() !== "" && (
          <div className="flex flex-col mt-2 text-red-500">{errorMsg}</div>
        )}
      </div>
    </div>
  );
};

export default AddSubAdmins;

const UserItem = ({ user, selectingUsers, checkIsAlreadySelected }) => {
  const isAlreadySelected = checkIsAlreadySelected(user);

  return (
    <div
      onClick={() => {
        selectingUsers(user);
      }}
      className={`w-full p-2 my-1 rounded-lg flex items-center
        ${
          isAlreadySelected
            ? `bg-gray-200 pointer-events-none cursor-not-allowed`
            : `hover:bg-gray-200 cursor-pointer`
        }`}
    >
      <div className="mr-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] font-semibold text-lg text-white flex justify-center items-center overflow-hidden">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
      <div className="w-full h-auto">
        <h2 className="font-semibold text-gray-700">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.collegeId}</p>
      </div>
    </div>
  );
};

const SelectedUserItem = ({ user, onRemove }) => {
  return (
    <div className="px-2 py-1 border-[1px] border-gray-300 rounded-md text-gray-500 text-sm flex items-center whitespace-nowrap gap-2">
      <div className="flex items-center">
        <div className="mr-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] font-semibold text-white flex justify-center items-center overflow-hidden">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
        <div className="w-full h-auto">
          <h2 className="font-semibold text-gray-700">{user.name}</h2>
          <p className="text-xs text-gray-500">{user.collegeId}</p>
        </div>
      </div>
      <div
        onClick={() => {
          onRemove(user);
        }}
        className="text-base px-1 flex items-center justify-center cursor-pointer hover:text-red-500"
      >
        <RxCross2 />
      </div>
    </div>
  );
};
