export interface Room {
  id: string;
  name: string;
  messages: Message[];
  date_created: string;
  date_updated: string;
}

export interface Message {
  id: string;
  content: string;
  device_id: string;
  date_created: string;
}
