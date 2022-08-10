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

	a = 0xfa;
	//b = _printf(NULL);
	//b = pf("dummy");
	//printbin(255);
	b = printf("%x\n", a);
	printf("%d\n", b);

	return (0);
}
