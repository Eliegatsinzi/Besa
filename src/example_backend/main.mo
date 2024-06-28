import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
  stable var apartments : [Apartment] = [];
  stable var users : [Text] = [];
  
  public type Apartment = {
    id: Nat;
    name: Text;
    address: Text;
    owner: Text;
    phone: Text;
    price: Text;
    description: Text;
    image: Text;
    status: Text
  };  

  public query func getHouse() : async [Apartment] {
    return apartments;
  };

  public query func getUsers() : async [Text] {
    return users;
  };


  public func addHouse(  id: Nat, name: Text, address: Text, owner: Text, phone: Text, price: Text, description: Text, image: Text, status: Text) : async () {
    let newHouse : [Apartment] = [{ id; name; address; owner; phone; price; description; image; status }];

    apartments := Array.append(apartments, newHouse);
  };

  public func addUser(hash: Text) : async () {
    let newUser : [Text] = [hash];

    users := Array.append(users, newUser);
  };

};
