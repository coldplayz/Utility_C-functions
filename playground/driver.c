#include <stdio.h>

int gcd(int a, int b);
long int int2mod(long int num, long int mod);
int mod_inverse(int num, int mod);
long int bigpwr2mod(long int base, long int idx, long int mod);


int main(void)
{
	int a, b;

	a = 688749;
	b = 254339;

	//printf("GCD of %d and %d: %d\n", a, b, gcd(a, b));
	//printf("%d in mod %d is %d\n", a, b, int2mod(a, b));
	//printf("Inverse of %d mod %d == %d\n", a, b, mod_inverse(a, b));
	printf("%ld\n", bigpwr2mod(a, b, 701111));

	return (0);
}
