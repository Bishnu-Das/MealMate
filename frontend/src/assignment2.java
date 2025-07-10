import java.util.Scanner;

public class assignment2{
    // public static void main(String[] args) {
    //     Scanner scanner = new Scanner(System.in);

    //     int a = scanner.nextInt();
    //     int b = scanner.nextInt();
    //     int c = scanner.nextInt();
    //     int large;

    //     if(a>b && a>c) large = a;
    //     else if(b>c && b>a) large = b;
    //     else large = c;

    //     System.out.println("largest number : "+large);
    // }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int number = sc.nextInt();
        String grad;
        if(number>=90 && number<=100) grad = "A+";
        if(number>=85 && number<90) grad = "A-";
        if(number>=70 && number<85) grad = "B";
        if(number>=57 && number<70) grad = "A-";
    }
}