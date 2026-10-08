export interface AuthDTO {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  email: string;
  role: string;
}

export interface MovieDTO {
  id?: number;
  title: string;
  description?: string;
  genre?: string;
  duration?: number;
  language?: string;
  releaseDate?: string;
}

export interface ShowDTO {
  id?: number;
  movieId: number;
  theatreId: number;
  startTime: string;
  ticketPrice: number;
}
export interface BookingDTO {
  id?: number;
  userId?: number;
  showId: number;
  numberOfSeats: number;
  totalPrice?: number;
  bookingTime?: string;
  status?: string;
}

export interface PaymentDTO {
  id?: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
}
export interface TheatreDTO {
  id?: number;
  name: string;
  location?: string;
  capacity?: number;
}
``