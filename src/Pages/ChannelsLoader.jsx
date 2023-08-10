import React from "react";

function ChannelListItem({ channel, user, setFocusedChannel }) {
  return (
    <div
      className="flex flex-row p-4 justify-evenly cursor-pointer border-b-black border"
      onClick={() => {
        setFocusedChannel(channel);
      }}
    >
      <img
        src={
          channel.user1_id === user.id ? channel.user2_pfp : channel.user1_pfp
        }
        alt="User Profile"
        className="w-16 rounded-full"
      />
      <h2 className="text-lg font-bold font-mono">
        {channel.user1_id === user.id ? channel.user2_name : channel.user1_name}
      </h2>
    </div>
  );
}

export function ChannelsLoader({ channels, user, setFocusedChannel }) {
  return (
    <div
      className="w-full bg-gray-200 h-[50vh] overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 64px)" }}
    >
      <div className="p-4 text-lg font-bold font-mono bg-blue-300 text-center">
        Channels
      </div>
      <div>
        {channels.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            user={user}
            setFocusedChannel={setFocusedChannel}
          />
        ))}
      </div>
    </div>
  );
}
