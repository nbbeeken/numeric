public class Test {
	public static void main() {
		var x0 = 12;
		x0 = 0b1010;
		x0 = 0o123;
		x0 = 0xa123;
		x0 = 1234567;
		x0 = 0xffff_ffff;
		x0 = 1234567n;
		x0 = 0b1_1_0_1_0_1;
		x0 = 0o777;
		x0 = 0xeeee;
		x0 = 1.1;

		long creditCardNumber = 1234_5678_9012_3456L;
		long socialSecurityNumber = 999_99_9999L;
		float pi =      3.14_15F;
		long hexBytes = 0xFF_EC_DE_5E;
		long hexWords = 0xCAFE_BABE;
		long maxLong = 0x7fff_ffff_ffff_ffffL;
		byte nybbles = 0b0010_0101;
		long bytes = 0b11010010_01101001_10010100_10010010;
	}
}
