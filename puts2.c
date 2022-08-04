#include "main.h"


/**
 * _puts - prints a string using _putchar
 * @str: string to print
 */
void _puts(char *str)
{
	int i;

	for (i = 0; *(str + i); i++)
	{
		_putchar(*(str + i));
	}
	_putchar('\n');
}

int main()
{
	_puts("strings are arrays of characters.");

	return (0);
}
