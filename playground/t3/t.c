#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"
int main()
{
	int a, b;

	a = _printf("%K\n");
	printf(" a: %d\n", a);
	b = printf("%K\n");
	printf(" b: %d\n", b);

	return (0);
}
