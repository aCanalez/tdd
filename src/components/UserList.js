import React, { Component } from "react";
import { loadUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem";
import Spinner from "./Spinner";

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 0,
      totalPages: 0,
    },
    pendingApiCall: false,
  };
  componentDidMount() {
    this.loadData();
  }

  loadData = async (pageIndex) => {
    try {
      this.setState({ pendingApiCall: true });
      const response = await loadUsers(pageIndex);
      const page = response.data;
      this.setState({ page: page });
    } catch (error) {}
    this.setState({ pendingApiCall: false });
  };

  render() {
    const { pendingApiCall } = this.state;
    const { totalPages, page, content } = this.state.page;
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content.map((user, i) => {
            return <UserListItem user={user} key={user.id} />;
          })}
        </ul>
        <div className="card-footer text-center">
          {page !== 0 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-start"
              onClick={() => this.loadData(page - 1)}
            >
              &lt; prev
            </button>
          )}
          {totalPages > page + 1 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-end"
              onClick={() => this.loadData(page + 1)}
            >
              next &gt;
            </button>
          )}
          {pendingApiCall && <Spinner />}
        </div>
      </div>
    );
  }
}

export default UserList;
