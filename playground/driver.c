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
	int b, c;


	//a = 0xff / 0x33;
	//b = _printf("Nuclear %s plan%c num%c%s: %x\n", "power", 't', 'b', "er", 255);
	b = _printf("%c%cth %s%s a%cg%s: Y%sou %s no%ching%s Snow.%c", 'W', 'i', "some ", "more", 'r', "s", "", "know", 't', ", Jon", '\n');
	c = printf("%c%cth %s%s a%cg%s: Y%sou %s no%ching%s Snow.%c", 'W', 'i', "some ", "more", 'r', "s", "", "know", 't', ", Jon", '\n');
	//b = pf("dummy");
	//b = printid(a);
	//printf("\n%b\n", 5);
	printf("b: %d\tc: %d\n", b, c);

	return (0);
}
