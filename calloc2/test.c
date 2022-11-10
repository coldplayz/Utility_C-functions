#include "sort.h"


int main(void)
{
	int *n;
	char *str;

	n = calloc2(sizeof(int) * 3);
	str = calloc2(sizeof(char) * 7);

	str[0] = 'M';
	str[1] = 'e';

	n[1] = 300;

	printf("%s\n%d\n%d\n%d\n", str, n[0], n[1], n[2]);

	return (0);
}
