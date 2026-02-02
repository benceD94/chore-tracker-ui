import type { RegistryEntryView } from "../hooks/queries/useRegistryQuery";

type UserMap = Record<string, {
  name: string,
  points: number,
  avatar?: string,
}>

export const getUserMap = (entries: RegistryEntryView[]) => {
  const userMap: UserMap = {};
  entries.forEach((entry) => {
    const userId = entry.userId;
    if (!userMap[userId]) userMap[userId] = {name: entry.userName.split(' ')[0], points: 0, avatar: entry.userPhotoURL};
    userMap[userId].points += entry.points
  })
  return userMap;
};