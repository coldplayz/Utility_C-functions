#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

int pf(const char *f, ...)
{
	va_list ap;

	va_start(ap, f);
	return (1);
}

int main()
{
	int b, a;


	a = 0xff / 0x33;
	b = _printf("Nuclear %s plan%c num%c%s: %b\n", "power", 't', 'b', "er", 4294967296);
	//b = pf("dummy");
	//b = printid(a);
	//printf("\n%b\n", 5);
	printf("%d\n", b);

	return (0);
}
