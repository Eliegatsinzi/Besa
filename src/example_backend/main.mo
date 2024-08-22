import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor {
  stable var apartments : [Apartment] = [];
  stable var users : [Text] = [];
  stable var staff : [Staff] = [];

  public type Apartment = {
    id: Nat;
    name: Text;
    address: Text;
    owner: Text;
    phone: Text;
    price: Text;
    description: Text;
    image: Text;
    status: Text;
    owner_principal: Text;
  };

  public type Booking = {
    apartmentId: Nat;
    userPrincipal: Principal;
    startISO: Text;
    endISO: Text;
    totalPrice: Text;
    customerName: Text;
    customerPhone: Text;
    customerEmail: Text;
    txRef: Text; // Unique transaction reference
    txId: Text; // Transaction ID, initialized to "none"
    paymentStatus: Text; // Payment status, initialized to "pending"
  };

  public type Staff = {
    nid: Text; // National ID
    password: Text;
    staffId: Text; // Unique Staff ID, provided from the frontend
  };

  stable var bookings : [Booking] = [];

  public query func getHouse() : async [Apartment] {
    return apartments;
  };

  public query func getUsers() : async [Text] {
    return users;
  };

  public query func getBookings() : async [Booking] {
    return bookings;
  };

  public query func getStaff() : async [Staff] {
    return staff;
  };

  public func addHouse(
    id: Nat,
    name: Text,
    address: Text,
    owner: Text,
    phone: Text,
    price: Text,
    description: Text,
    image: Text,
    status: Text,
    owner_principal: Text
  ) : async () {
    let newHouse : [Apartment] = [{
      id;
      name;
      address;
      owner;
      phone;
      price;
      description;
      image;
      status;
      owner_principal;
    }];

    apartments := Array.append(apartments, newHouse);
  };

  public func addUser(hash: Text) : async () {
    let newUser : [Text] = [hash];
    users := Array.append(users, newUser);
  };

  public func addStaff(
    nid: Text,
    password: Text,
    staffId: Text // Staff ID provided by frontend
  ) : async () {
    let newStaff : [Staff] = [{
      nid;
      password;
      staffId
    }];

    staff := Array.append(staff, newStaff);
  };

  public func addBooking(
    apartmentId: Nat,
    userPrincipal: Principal,
    startISO: Text,
    endISO: Text,
    totalPrice: Text,
    customerName: Text,
    customerPhone: Text,
    customerEmail: Text,
    txRef: Text, // Unique transaction reference
    txId: Text, // Transaction ID, initialized to "none"
    paymentStatus: Text // Payment status, initialized to "pending"
  ) : async () {
    let newBooking : [Booking] = [{
      apartmentId;
      userPrincipal;
      startISO;
      endISO;
      totalPrice;
      customerName;
      customerPhone;
      customerEmail;
      txRef;
      txId;
      paymentStatus;
    }];
    
    bookings := Array.append(bookings, newBooking);
  };

  public func updateBooking(
    txRef: Text,
    txId: Text,
    paymentStatus: Text
  ) : async Bool {
    let updatedBookings = Array.filter<Booking>(bookings, func (booking) {
      booking.txRef == txRef
    });
    
    if (Array.size(updatedBookings) == 0) {
      return false; // Booking with this txRef not found
    };
    
    let updatedBooking = updatedBookings[0];
    let newBooking = {
      apartmentId = updatedBooking.apartmentId;
      userPrincipal = updatedBooking.userPrincipal;
      startISO = updatedBooking.startISO;
      endISO = updatedBooking.endISO;
      totalPrice = updatedBooking.totalPrice;
      customerName = updatedBooking.customerName;
      customerPhone = updatedBooking.customerPhone;
      customerEmail = updatedBooking.customerEmail;
      txRef = txRef;
      txId = txId;
      paymentStatus = paymentStatus;
    };
    
    bookings := Array.filter<Booking>(bookings, func (booking) {
      booking.txRef != txRef
    });
    
    bookings := Array.append(bookings, [newBooking]);
    return true; // Successfully updated
  };

  public func staffLogin(nid: Text, password: Text) : async Bool {
    let loggedIn = Array.filter<Staff>(staff, func (s) {
      s.nid == nid and s.password == password
    });
    
    return Array.size(loggedIn) > 0;
  };

    // New function to get staff information by nid
  public query func getStaffByNid(nid: Text) : async ?Staff {
    let staffMember = Array.find<Staff>(staff, func (s) {
      s.nid == nid
    });
    
    return staffMember;
  };
};
