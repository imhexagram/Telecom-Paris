import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Scanner;
import java.util.GregorianCalendar;
import java.util.Date;
public class babyhash {

  public static void main(String[] args) throws NoSuchAlgorithmException, UnsupportedEncodingException {
    System.out.println("Enter some data for a small hash generation");
    System.out.println("For BabyHash, all input data is converted to lower case");
    Date time1 = new Date();
    long t_begin= time1.getTime();
    long t_end,ex_time;

    Scanner sc = new Scanner(System.in); //lire l’entête
    String inputString = sc.nextLine();
    inputString = inputString.toLowerCase();
    String babyHash ="FFFF"; //initialiser une variable représentant les x premiers caractères du hash.
    int i=0; //variable représentant le nonce à incrémenter
    /*while babyHash != "0"{
      String hash=ComputeSHA_256_as_Hex_String(inputString.concat(i));
      if (hash<babyHash){
        printf("Y");
        printf(hash);
        return hash
      }else{
        i=i+1;
        printf(i);
      }
    }
    Tant que le babyhash n’est pas zéro
    {
    Concatène inputString à i avec la fonction concat()
    Calcule le hash avec ComputeSHA_256_as_Hex_String ()
    Sépare les x premiers caractères du hash avec la substring()
    Afficher le nonce
    Afficher le hash
    Incrémente le nonce
    }*/
    String target = "000";
    while(!babyHash.startWith(target)){
      String hashInput = inputString.concat(Integer.toString(i));
      babyHash = ComputeSHA_256_as_Hex_String(hashInput);
      i++;
    }
    system.out.println("i : " + (i-1));
    system.out.println(babyHash);
    Date now = new Date();
    ex_time=now.getTime()-t_begin;
    System.out.println("Mining time = "+ex_time/(1000) +" sec");

    sc.close();
    }

 public static String ComputeSHA_256_as_Hex_String(String text) {
  /* 
    MessageDigest m = MessageDigest.getInstance("SHA-256");
    byte[] hashBytes = m.digest(m.digest(text.getBytes("UTF-8")));
    
    ByteBuffer buffer = ByteBuffer.wrap(hashBytes);
    buffer.order(ByteOrder.LITTLE_ENDIAN);
    byte[] bigEndianBytes = new byte[hashBytes.length];
    buffer.get(bigEndianBytes);
    
    hash = convertToHex(bigEndianBytes);
    return hash*/
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    byte[] hash = digest.digest(text.getBytes("UTF-8"));
    return convertToHex(hash);
 }

 private static String convertToHex(byte[] data) {
    StringBuilder hexStringBuilder = new StringBuilder();
    for (byte b : data){
      hexStringBuilder.append(String.format("%02x",b));
    }
    return hexStringBuilder.toString();
  }
}
