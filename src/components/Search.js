import React from "react";
import "../styles.css";
import axios from "axios";
import Loader from "../loader.gif";
import PageNavigation from "./PageNavigation";
import { Link } from "react-router-dom";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: {},
      loading: false,
      message: "",
      totalResults: 0,
      totalPages: 0,
      currentPageNo: 0,
    };

    this.cancel = "";
  }
  componentDidMount() {
    this.fetchSearchResults(0, "d");
  }
  getPageCount = (total, denominator) => {
    const divisible = 0 === total % denominator;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  fetchSearchResults = (updatedPageNo = "", query) => {
    const pageNumber = updatedPageNo
      ? `&pageSize=10&page=${updatedPageNo}`
      : "";
    const YOUR_API_KEY = "8d536c8daadb473c97f845cee7dc216f";
    const url = `https://newsapi.org/v2/top-headlines?q=${query}&country=us&apiKey=${YOUR_API_KEY}${pageNumber}`;

    if (this.cancel) {
      this.cancel.cancel();
    }

    this.cancel = axios.CancelToken.source();

    axios
      .get(url, {
        cancelToken: this.cancel.token,
      })
      .then((res) => {
        const total = res.data.totalResults;
        const totalPagesCount = this.getPageCount(total, 10);
        const resultNotFoundMsg = !res.data.articles.length
          ? "There are no more search results. Please try a new search"
          : "";
        this.setState({
          results: res.data.articles,
          message: resultNotFoundMsg,
          totalResults: total,
          totalPages: totalPagesCount,
          currentPageNo: updatedPageNo,
          loading: false,
        });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: "Failed to fetch the data. Please check network",
          });
        }
      });
  };

  handleOnInputChange = (event) => {
    const query = event.target.value;
    if (!query) {
      this.setState({
        query,
        results: {},
        message: "",
        totalPages: 0,
        totalResults: 0,
      });
    } else {
      this.setState({ query, loading: true, message: "" }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };

  handlePageClick = (type) => {
    event.preventDefault();
    const updatePageNo =
      "prev" === type
        ? this.state.currentPageNo - 1
        : this.state.currentPageNo + 1;

    if (!this.state.loading) {
      this.setState({ loading: true, message: "" }, () => {
        this.fetchSearchResults(updatePageNo, this.state.query);
      });
    }
  };

  renderSearchResults = () => {
    const { results } = this.state;

    if (Object.keys(results).length && results.length) {
      return (
        <div className="container-fluid">
          {results.map((result, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-12 mt-3">
                  <div className="card">
                    <div className="card-horizontal">
                      <div className="img-square-wrapper">
                        <img
                          className=""
                          src={result.urlToImage}
                          alt="Card image cap"
                          width="200"
                        />
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{result.title}</h4>
                        <p className="card-text">{result.content}</p>
                        <Link
                          to={{
                            pathname: `/news/details`,
                            result,
                          }}
                        >
                          Read More...
                        </Link>
                      </div>
                    </div>
                    <div className="card-footer">
                      <small className="text-muted">
                        {result.author} | {Date(result.publishedAt)} |{" "}
                        {result.source.name}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  render() {
    const { query, loading, message, currentPageNo, totalPages } = this.state;

    const showPrevLink = 1 < currentPageNo;
    const showNextLink = totalPages > currentPageNo;

    return (
      <div className=".container-fluid">
        <h2 className="heading">Live New App for UK and US</h2>
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            name="query"
            value={query}
            id="search-input"
            placeholder="Filter By Title..."
            onChange={this.handleOnInputChange}
          />
        </label>

        {/*	Error Message*/}
        {message && <p className="message">{message}</p>}

        {/*	Loader*/}
        <img
          src={Loader}
          className={`search-loading ${loading ? "show" : "hide"}`}
          alt="loader"
        />

        {/*Navigation*/}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={() => this.handlePageClick("prev", event)}
          handleNextClick={() => this.handlePageClick("next", event)}
        />

        {/*	Result*/}
        {this.renderSearchResults()}

        {/*Navigation*/}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={() => this.handlePageClick("prev", event)}
          handleNextClick={() => this.handlePageClick("next", event)}
        />
      </div>
    );
  }
}

export default Search;
