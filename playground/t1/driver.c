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
	b = _printf("Nuclear %s plan%c num%c%s: %d\n", "power", 't', 'b', "er", a);
	//b = pf("dummy");
	//b = printid(a);
	//printf("\n%d\n", a);
	printf("%d\n", b);

	return (0);
}
