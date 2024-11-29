import React from "react";
import { useState, useReducer, useMemo, useEffect } from "react";
import {
  bold,
  italic,
  underline,
  strikeout,
  interceptConsoleLog,
  inspect,
} from "@teaui/core";
import {
  Accordion,
  Box,
  Br,
  Button,
  Checkbox,
  Collapsible,
  CollapsibleText,
  ConsoleLog,
  Digits,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Drawer,
  Input,
  Scrollable,
  Separator,
  Slider,
  Space,
  Stack,
  Style,
  Tabs,
  Text,
  ToggleGroup,
  run,
} from "@teaui/react";

async function send(url: string, bearerToken: string) {
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
  };

  try {
    const response = await fetch(url, { headers });
    if (response.status === 200) {
      const success = await response.json();
      return { success };
    } else {
      const body = await response.json();
      const headers = response.headers;
      return { error: { body, headers } };
    }
  } catch (error) {
    return { error };
  }
}

async function fetchUser(username: string, bearerToken: string) {
  const url = `https://api.x.com/2/users/by/username/${username}`;

  return send(url, bearerToken);
}

async function fetchTweets(userId: string, bearerToken: string) {
  const url = `https://api.x.com/2/users/${userId}/tweets`;

  return send(url, bearerToken);
}

async function deleteTweet(tweetId: string, bearerToken: string) {
  const url = `https://api.x.com/2/tweets/${tweetId}`;

  return send(url, bearerToken);
}

function createAPI(bearerToken: string) {
  return {
    fetchUser: (username: string) => fetchUser(username, bearerToken),
    fetchTweets: (userId: string) => fetchTweets(userId, bearerToken),
    deleteTweet: (tweetId: string) => deleteTweet(tweetId, bearerToken),
  };
}

// Example usage:
const defaultUsername = "colinta";
const bearerToken =
  "AAAAAAAAAAAAAAAAAAAAADD9wwEAAAAAUgVT9XCLzMn9v5HZQX4MdKuQOSk%3DCpu4TpyiTSQzv0rq5z4GpC0Wy5uavz48RHsOhE2J6V2GEy7l5u";
const api = createAPI(bearerToken);

function useToggle(initial: boolean) {
  return useReducer((state) => !state, initial);
}

function RMX() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | undefined>(undefined);
  const [username, setUsername] = useState<any | undefined>(defaultUsername);
  const [user, setUser] = useState<any>();
  const [tweets, setTweets] = useState<any[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    setIsLoading(true);
    if (!username) {
      return setError("Required: username");
    }

    api
      .fetchUser(username)
      .then(({ error, success: user }) => {
        setUser(inspect(user));
        if (user) {
          return api.fetchTweets(user.id).then(({ error, success: tweets }) => {
            if (tweets) {
              setTweets(tweets);
            } else {
              setError(inspect(error));
            }
            setIsLoading(false);
          });
        } else {
          setError(inspect(error));
        }
        setIsLoading(false);
      })
      .catch((error) => {});
  };

  return (
    <Drawer.bottom>
      <Box>
        <Text wrap>
          {isLoading ? (
            "…"
          ) : error ? (
            <>
              {user}
              <br />
              {error}
            </>
          ) : (
            <Tweets tweets={tweets} />
          )}
        </Text>
      </Box>
      <Stack.right gap={1}>
        <Button onClick={fetchUser} title="Fetch" />
        Username:
        <Input
          flex={1}
          value={username}
          placeholder="username"
          onChange={setUsername}
        />
      </Stack.right>
    </Drawer.bottom>
  );
}

function Tweets({ tweets }: { tweets: any[] }) {
  return <>{inspect(tweets)}</>;
}

interceptConsoleLog();

run(<RMX />);
