export const IndexerList = (
  props
) => {
  const {
    // registry,

    global,
    dispatchState,
    dispatchEvent,
    registerEvent,
    renderPlasmicElement,
    plasmicRootClassName,
  } = props;

  const accountId = context.accountId;

  State.init({
    my_indexers: [],
    all_indexers: [],
    currentPage: 0,
    total_indexers: 0,
    selected_indexer: undefined,
    selected_account: undefined,
    selectedTab: props.tab || "all",
  });

  const data = {
    All: {
      "morgs.near": {},
      "daruns.near": {},
      "roshaan.near": {
        "demo-2": {
          code: '\n  // Add your code here\n  const h = block.header().height;\n  await context.set("height", h);\n',
          start_block_height: null,
          schema:
            'CREATE TABLE\n  "indexer_storage" (\n    "function_name" TEXT NOT NULL,\n    "key_name" TEXT NOT NULL,\n    "value" TEXT NOT NULL,\n    PRIMARY KEY ("function_name", "key_name")\n  )\n',
          filter: {
            indexer_rule_kind: "Action",
            matching_rule: {
              status: "ANY",
              function: "set",
              rule: "ACTION_FUNCTION_CALL",
              affected_account_id: "social.near",
            },
            id: null,
            name: null,
          },
        },
      },
      "flatirons.near": {},
      "dataplatform.near": {
        social_feed: {
          code: '\n  function base64decode(encodedValue) {\n    let buff = Buffer.from(encodedValue, "base64");\n    return JSON.parse(buff.toString("utf-8"));\n  }\n\n  async function handlePostCreation(\n    accountId,\n    blockHeight,\n    blockTimestamp,\n    receiptId,\n    content\n  ) {\n    try {\n      const mutationData = {\n        post: {\n          account_id: accountId,\n          block_height: blockHeight,\n          block_timestamp: blockTimestamp,\n          content: content,\n          receipt_id: receiptId,\n        },\n      };\n\n      // Call GraphQL mutation to insert a new post\n      await context.graphql(\n        `mutation createPost($post: dataplatform_near_social_feed_posts_insert_input!){\n    insert_dataplatform_near_social_feed_posts_one(\n      object: $post\n    ) {\n      account_id\n      block_height\n    }\n  }`,\n        mutationData\n      );\n\n      console.log(`Post by ${accountId} has been added to the database`);\n    } catch (e) {\n      console.log(\n        `Failed to store post by ${accountId} to the database (perhaps it already stored)`\n      );\n    }\n  }\n\n  async function handleCommentCreation(\n    accountId,\n    blockHeight,\n    blockTimestamp,\n    receiptId,\n    commentString\n  ) {\n    const comment = JSON.parse(commentString);\n    const postAuthor = comment.item.path.split("/")[0];\n    const postBlockHeight = comment.item.blockHeight;\n\n    // find post to retrieve Id or print a warning that we don\'t have it\n    try {\n      // Call GraphQL query to fetch posts that match specified criteria\n      const posts = await context.graphql(\n        `query getPosts($accountId: String = "$accountId", $blockHeight: numeric = "$blockHeight"){\n    dataplatform_near_social_feed_posts(\n      where: {\n        account_id: {_eq: $accountId},\n        block_height: {_eq: $blockHeight}\n      },\n      limit: 1\n    ) {\n      account_id\n      accounts_liked\n      block_height\n      block_timestamp\n      content\n      id\n    }\n  }`,\n        {\n          accountId: postAuthor,\n          blockHeight: postBlockHeight,\n        }\n      );\n      console.log(`posts: ${JSON.stringify(posts)}`);\n      if (posts.dataplatform_near_social_feed_posts.length === 0) {\n        return;\n      }\n\n      const post = posts.dataplatform_near_social_feed_posts[0];\n\n      try {\n        delete comment["item"];\n        const mutationData = {\n          comment: {\n            account_id: accountId,\n            receipt_id: receiptId,\n            block_height: blockHeight,\n            block_timestamp: blockTimestamp,\n            content: JSON.stringify(comment),\n            post_id: post.id,\n          },\n        };\n        // Call GraphQL mutation to insert a new comment\n        await context.graphql(\n          `mutation createComment($comment: dataplatform_near_social_feed_comments_insert_input!){\n    insert_dataplatform_near_social_feed_comments_one(\n      object: $comment\n    ) {\n      account_id\n      receipt_id\n      block_height\n      block_timestamp\n      content\n      post_id\n    }\n  }`,\n          mutationData\n        );\n\n        // Update last comment timestamp in Post table\n        const currentTimestamp = Date.now();\n        await context.graphql(\n          `mutation SetLastCommentUpdated {\n  update_dataplatform_near_social_feed_posts(\n    where: {id: {_eq: ${post.id}}}\n    _set: {last_comment_timestamp: ${currentTimestamp}}\n  )\n  {\n    returning {\n      id\n    }\n  }\n}\n  `,\n          {}\n        );\n        console.log(`Comment by ${accountId} has been added to the database`);\n      } catch (e) {\n        console.log(\n          `Failed to store comment to the post ${postAuthor}/${postBlockHeight} by ${accountId} perhaps it has already been stored. Error ${e}`\n        );\n      }\n    } catch (e) {\n      console.log(\n        `Failed to store comment to the post ${postAuthor}/${postBlockHeight} as we don\'t have the post stored.`\n      );\n    }\n  }\n\n  async function handleLike(\n    accountId,\n    blockHeight,\n    blockTimestamp,\n    receiptId,\n    likeContent\n  ) {\n    const like = JSON.parse(likeContent);\n    const likeAction = like.value.type; // like or unlike\n    const [itemAuthor, _, itemType] = like.key.path.split("/", 3);\n    const itemBlockHeight = like.key.blockHeight;\n    console.log("handling like", receiptId, accountId);\n    switch (itemType) {\n      case "main":\n        try {\n          const posts = await context.graphql(\n            `query getPosts($accountId: String = "$accountId", $blockHeight: numeric = "$blockHeight"){\n    dataplatform_near_social_feed_posts(\n      where: {\n        account_id: {_eq: $accountId},\n        block_height: {_eq: $blockHeight}\n      },\n      limit: 1\n    ) {\n      account_id\n      accounts_liked\n      block_height\n      block_timestamp\n      content\n      id\n    }\n  }`,\n            {\n              accountId: itemAuthor,\n              blockHeight: itemBlockHeight,\n            }\n          );\n          if (posts.dataplatform_near_social_feed_posts.length == 0) {\n            return;\n          }\n\n          const post = posts.dataplatform_near_social_feed_posts[0];\n          switch (likeAction) {\n            case "like":\n              await _handlePostLike(\n                post.id,\n                accountId,\n                blockHeight,\n                blockTimestamp,\n                receiptId\n              );\n              break;\n            case "unlike":\n            default:\n              await _handlePostUnlike(post.id, accountId);\n              break;\n          }\n        } catch (e) {\n          console.log(\n            `Failed to store like to post ${itemAuthor}/${itemBlockHeight} as we don\'t have it stored in the first place.`\n          );\n        }\n        break;\n      case "comment":\n        // Comment\n        console.log(`Likes to comments are not supported yet. Skipping`);\n        break;\n      default:\n        // something else\n        console.log(`Got unsupported like type "${itemType}". Skipping...`);\n        break;\n    }\n  }\n\n  async function _handlePostLike(\n    postId,\n    likeAuthorAccountId,\n    likeBlockHeight,\n    blockTimestamp,\n    receiptId\n  ) {\n    try {\n      const posts = await context.graphql(\n        `query getPosts($postId: Int!) {\n  dataplatform_near_social_feed_posts(where: { id: { _eq: $postId } }) {\n    id\n    account_id\n    block_height\n    block_timestamp\n    content\n    accounts_liked\n  }\n}`,\n        { postId: postId }\n      );\n      if (posts.dataplatform_near_social_feed_posts.length == 0) {\n        return;\n      }\n      const post = posts.dataplatform_near_social_feed_posts[0];\n      let accountsLiked =\n        post.accounts_liked.length === 0\n          ? post.accounts_liked\n          : JSON.parse(post.accounts_liked);\n\n      if (accountsLiked.indexOf(likeAuthorAccountId) === -1) {\n        accountsLiked.push(likeAuthorAccountId);\n      }\n\n      // Call GraphQL mutation to update a post\'s liked accounts list\n      await context.graphql(\n        `mutation updatePost($postId: Int!, $likedAccount: jsonb){\n    update_dataplatform_near_social_feed_posts(\n      where: {id: {_eq: $postId}}\n      _set: {accounts_liked: $likedAccount}\n    ) {\n     returning {\n      id\n    }\n    }\n  }`,\n        {\n          postId: postId,\n          likedAccount: JSON.stringify(accountsLiked),\n        }\n      );\n\n      const postLikeMutation = {\n        postLike: {\n          post_id: postId,\n          account_id: likeAuthorAccountId,\n          block_height: likeBlockHeight,\n          block_timestamp: blockTimestamp,\n          receipt_id: receiptId,\n        },\n      };\n      // Call GraphQL mutation to insert a new like for a post\n      await context.graphql(\n        `\n  mutation InsertLike($postLike: dataplatform_near_social_feed_post_likes_insert_input!) {\n    insert_dataplatform_near_social_feed_post_likes_one(object: $postLike) {\n      post_id\n    }\n  }\n`,\n        postLikeMutation\n      );\n    } catch (e) {\n      console.log(`Failed to store like to in the database: ${e}`);\n    }\n  }\n\n  async function _handlePostUnlike(postId, likeAuthorAccountId) {\n    try {\n      const posts = await context.graphql(\n        `query getPosts($postId: Int!) {\n  dataplatform_near_social_feed_posts(where: { id: { _eq: $postId } }) {\n    id\n    account_id\n    block_height\n    block_timestamp\n    content\n    accounts_liked\n  }\n}`,\n        { postId: postId }\n      );\n      if (posts.dataplatform_near_social_feed_posts.length == 0) {\n        return;\n      }\n      const post = posts.dataplatform_near_social_feed_posts[0];\n      let accountsLiked =\n        post.accounts_liked.length === 0\n          ? post.accounts_liked\n          : JSON.parse(post.accounts_liked);\n\n      console.log(accountsLiked);\n\n      let indexOfLikeAuthorAccountIdInPost =\n        accountsLiked.indexOf(likeAuthorAccountId);\n      if (indexOfLikeAuthorAccountIdInPost > -1) {\n        accountsLiked.splice(indexOfLikeAuthorAccountIdInPost, 1);\n        // Call GraphQL mutation to update a post\'s liked accounts list\n        await context.graphql(\n          `mutation updatePost($postId: Int!, $likedAccount: jsonb){\n    update_dataplatform_near_social_feed_posts(\n      where: {id: {_eq: $postId}}\n      _set: {accounts_liked: $likedAccount}\n    ) {\n     returning {\n      id\n    }\n    }\n  }`,\n          {\n            postId: postId,\n            likedAccount: JSON.stringify(accountsLiked),\n          }\n        );\n      }\n      // Call GraphQL mutation to delete a like for a post\n      await context.graphql(\n        `mutation deletePostLike($accountId: String!, $postId: Int!){\n    delete_dataplatform_near_social_feed_post_likes(\n      where: {\n        _and: [\n          {account_id: {_eq: $accountId}},\n          {post_id: {_eq: $postId}}\n        ]\n      }\n    ) {\n      returning {\n        post_id\n        account_id\n      }\n    }\n  }`,\n        {\n          accountId: likeAuthorAccountId,\n          postId: postId,\n        }\n      );\n    } catch (e) {\n      console.log(`Failed to delete like from the database: ${e}`);\n    }\n  }\n\n  // Add your code here\n  const SOCIAL_DB = "social.near";\n\n  const nearSocialPosts = block\n    .actions()\n    .filter((action) => action.receiverId === SOCIAL_DB)\n    .flatMap((action) =>\n      action.operations\n        .map((operation) => operation["FunctionCall"])\n        .filter((operation) => operation?.methodName === "set")\n        .map((functionCallOperation) => ({\n          ...functionCallOperation,\n          args: base64decode(functionCallOperation.args),\n          receiptId: action.receiptId, // providing receiptId as we need it\n        }))\n        .filter((functionCall) => {\n          const accountId = Object.keys(functionCall.args.data)[0];\n          return (\n            Object.keys(functionCall.args.data[accountId]).includes("post") ||\n            Object.keys(functionCall.args.data[accountId]).includes("index")\n          );\n        })\n    );\n\n  if (nearSocialPosts.length > 0) {\n    console.log("Found Near Social Posts in Block...");\n    const blockHeight = block.blockHeight;\n    const blockTimestamp = block.header().timestampNanosec;\n    await Promise.all(\n      nearSocialPosts.map(async (postAction) => {\n        const accountId = Object.keys(postAction.args.data)[0];\n        console.log(`ACCOUNT_ID: ${accountId}`);\n\n        // if creates a post\n        if (\n          postAction.args.data[accountId].post &&\n          Object.keys(postAction.args.data[accountId].post).includes("main")\n        ) {\n          console.log("Creating a post...");\n          await handlePostCreation(\n            accountId,\n            blockHeight,\n            blockTimestamp,\n            postAction.receiptId,\n            postAction.args.data[accountId].post.main\n          );\n        } else if (\n          postAction.args.data[accountId].post &&\n          Object.keys(postAction.args.data[accountId].post).includes("comment")\n        ) {\n          // if creates a comment\n          await handleCommentCreation(\n            accountId,\n            blockHeight,\n            blockTimestamp,\n            postAction.receiptId,\n            postAction.args.data[accountId].post.comment\n          );\n        } else if (\n          Object.keys(postAction.args.data[accountId]).includes("index")\n        ) {\n          // Probably like or unlike action is happening\n          if (\n            Object.keys(postAction.args.data[accountId].index).includes("like")\n          ) {\n            console.log("handling like");\n            await handleLike(\n              accountId,\n              blockHeight,\n              blockTimestamp,\n              postAction.receiptId,\n              postAction.args.data[accountId].index.like\n            );\n          }\n        }\n      })\n    );\n  }\n',
          start_block_height: 96170988,
          schema:
            'CREATE TABLE\n  "posts" (\n    "id" SERIAL NOT NULL,\n    "account_id" VARCHAR NOT NULL,\n    "block_height" DECIMAL(58, 0) NOT NULL,\n    "receipt_id" VARCHAR NOT NULL,\n    "content" TEXT NOT NULL,\n    "block_timestamp" DECIMAL(20, 0) NOT NULL,\n    "accounts_liked" JSONB NOT NULL DEFAULT \'[]\',\n    "last_comment_timestamp" DECIMAL(20, 0),\n    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")\n  );\n\nCREATE TABLE\n  "comments" (\n    "id" SERIAL NOT NULL,\n    "post_id" SERIAL NOT NULL,\n    "account_id" VARCHAR NOT NULL,\n    "block_height" DECIMAL(58, 0) NOT NULL,\n    "content" TEXT NOT NULL,\n    "block_timestamp" DECIMAL(20, 0) NOT NULL,\n    "receipt_id" VARCHAR NOT NULL,\n    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")\n  );\n\nCREATE TABLE\n  "post_likes" (\n    "post_id" SERIAL NOT NULL,\n    "account_id" VARCHAR NOT NULL,\n    "block_height" DECIMAL(58, 0),\n    "block_timestamp" DECIMAL(20, 0) NOT NULL,\n    "receipt_id" VARCHAR NOT NULL,\n    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id", "account_id")\n  );\n\nCREATE UNIQUE INDEX "posts_account_id_block_height_key" ON "posts" ("account_id" ASC, "block_height" ASC);\n\nCREATE UNIQUE INDEX "comments_post_id_account_id_block_height_key" ON "comments" (\n  "post_id" ASC,\n  "account_id" ASC,\n  "block_height" ASC\n);\n\nCREATE INDEX\n  "posts_last_comment_timestamp_idx" ON "posts" ("last_comment_timestamp" DESC);\n\nALTER TABLE\n  "comments"\nADD\n  CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;\n\nALTER TABLE\n  "post_likes"\nADD\n  CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;\n',
          filter: {
            indexer_rule_kind: "Action",
            matching_rule: {
              rule: "ACTION_ANY",
              affected_account_id: "social.near",
              status: "SUCCESS",
            },
            id: null,
            name: null,
          },
        },
      },
    },
  };

  const indexers = [];

  const total_indexers = 0;

  Object.keys(data.All).forEach((accountId) => {
    Object.keys(data.All[accountId]).forEach((functionName) => {
      indexers.push({
        accountId: accountId,
        indexerName: functionName,
      });
      total_indexers += 1;
    });
  });

  const my_indexers = indexers.filter(
    (indexer) => indexer.accountId === accountId
  );

  console.log(indexers);

  State.update({
    all_indexers: [...indexers],
    my_indexers: my_indexers,
    total_indexers: total_indexers,
  });

  // Near.asyncView(registry, 'list_indexer_functions').then((data) => {
  //   const indexers = [];

  //   const total_indexers = 0;

  //   Object.keys(data.All).forEach((accountId) => {
  //     Object.keys(data.All[accountId]).forEach((functionName) => {
  //       indexers.push({
  //         accountId: accountId,
  //         indexerName: functionName,
  //       });
  //       total_indexers += 1;
  //     });
  //   });

  //   const my_indexers = indexers.filter(
  //     (indexer) => indexer.accountId === accountId
  //   );

  //   State.update({
  //     my_indexers: my_indexers,
  //     all_indexers: indexers,
  //     total_indexers: total_indexers,
  //   });
  // });

  return (
    <div
      className={'bos ' + plasmicRootClassName}
    >
      {state.all_indexers && state.all_indexers.map((indexer, i) =>
        renderPlasmicElement(
          "card",
          {
            onClick: () => {
              dispatchState({ selectedIndexer: indexer })
            },
            key: `indexer-${indexer.accountId}-${i}`,
            children: (
              <>
                <div>{renderPlasmicElement("img", {})}</div>

                <div>
                  {renderPlasmicElement("text", { children: indexer.accountId })}

                  {renderPlasmicElement("subtext", { children: indexer.indexerName })}
                </div>
              </>
            )
          }
        )
      )}
    </div>
  );
}
