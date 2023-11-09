export const IndexerView = (props) => {
  const {
    global,
    endpoint,
    dispatchState,
    dispatchEvent,
    registerEvent,
    renderPlasmicElement,
    plasmicRootClassName,
  } = props

  const {
    selectedIndexer,
  } = global || {}

  if (!selectedIndexer) {
    return (
      <div
        className={plasmicRootClassName}
      >
        missing selectedIndexer
      </div>
    );
  }

  const {
    accountId,
    indexerName,
  } = selectedIndexer

  const LIMIT = 20;

  State.init({
    logs: [],
    state: [],
    indexer_res: [],
    logsPage: 0,
    statePage: 0,
    logsCount: 0,
    stateCount: 0,
    indexer_resPage: 0,
    indexer_resCount: 0,
    current: selectedIndexer,
  });

  console.log('current', state.current)

  function fetchGraphQL(operationsDoc, operationName, variables) {
    return asyncFetch(`${endpoint}/v1/graphql`, {
      method: "POST",
      headers: {
        "x-hasura-role": "append",
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });
  }

  const logsDoc = `
      query QueryLogs($offset: Int) {
        indexer_log_entries(order_by: {timestamp: desc}, limit: ${LIMIT}, offset: $offset, where: {function_name: {_eq: "${accountId}/${indexerName}"}}) {
          block_height
          message
          timestamp
        }
        indexer_log_entries_aggregate(where: {function_name: {_eq: "${accountId}/${indexerName}"}}) {
        aggregate {
          count
        }
      }
    }
  `;

  const indexerStateDoc = `
    query IndexerState($offset: Int) {
      indexer_state(limit: ${LIMIT}, offset: $offset, where: {function_name: {_eq: "${accountId}/${indexerName}"}}) {
        status
        function_name
        current_block_height
        current_historical_block_height
      }
    }
  `;

  const isEquals = state.current.accountId === accountId
    && state.current.indexerName === indexerName

  if (!state.initialFetch || !isEquals) {
    State.update({ current: selectedIndexer });

    fetchGraphQL(logsDoc, "QueryLogs", {
      offset: state.logsPage * LIMIT,
    }).then((result) => {
      if (result.status === 200) {
        State.update({
          logs: result.body.data[`indexer_log_entries`],
          logsCount:
            result.body.data[`indexer_log_entries_aggregate`].aggregate.count,
        });
      }
    });

    fetchGraphQL(indexerStateDoc, "IndexerState", {
      offset: 0,
    }).then((result) => {
      if (result.status === 200) {
        if (result.body.data.indexer_state.length == 1) {
          State.update({
            state: result.body.data.indexer_state,
            stateCount: result.body.data.indexer_state_aggregate.aggregate.count,
          });
        }
      }
    });
    State.update({ initialFetch: true });
  }

  const onLogsPageChange = (page) => {
    page = page - 1;

    if (page === state.logsPage) {
      console.log(`Selected the same page number as before: ${pageNumber}`);
      return;
    }

    try {
      fetchGraphQL(logsDoc, "QueryLogs", { offset: page * LIMIT }).then(
        (result) => {
          if (result.status === 200) {
            State.update({
              logs: result.body.data.indexer_log_entries,
              logsCount:
                result.body.data.indexer_log_entries_aggregate.aggregate.count,
            });
          }
        }
      );
    } catch (e) {
      console.log("error:", e);
    }

    State.update({ logsPage: page, currentPage: page });
  };

  return (
    <div
      className={plasmicRootClassName}
    >
      <div>
        <span>Indexer State </span>

        {state.state.length > 0 ? (
          <div class="table-responsive mt-3">
            <table
              class="table-striped table"
              style={{
                padding: "30px",
                "table-layout": "fixed",
              }}
            >
              <thead>
                <tr>
                  <th>Function Name</th>
                  <th>Current Block Height</th>
                  <th>Current Historical Block Height</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.state.map((x) => (
                  <tr>
                    <td>{x.function_name}</td>
                    <td>{x.current_block_height}</td>
                    <td>
                      {x.current_historical_block_height}
                    </td>
                    <td>{x.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span> No data to show... </span>
        )}

        <span> Indexer Logs</span>

        {state.logs.length > 0 ? (
          <div>
            <div class="table-responsive mt-3">
              <table
                class="table-striped table"
                style={{
                  padding: "30px",
                  "table-layout": "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Block Height</th>
                    <th style={{ width: "20%" }}>Timestamp</th>
                    <th style={{ width: "80%" }}>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {state.logs.map((x) => (
                    <tr>
                      <td>{x.block_height}</td>
                      <td>{x.timestamp}</td>
                      <td>{x.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Widget
              src="roshaan.near/widget/Paginate-fork"
              props={{
                siblingCount: 1,
                totalCount: state.logsCount,
                pageSize: LIMIT,
                onPageChange: onLogsPageChange,
                currentPage: state.logsPage,
              }}
            />
          </div>
        ) : (
          <span> No data to show... </span>
        )}
      </div>
    </div>
  )
}
