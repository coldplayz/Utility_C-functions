#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * print_any2 - prints optional arguments based on the format specified by c
 * @ap: an argument pointer
 * @c: character specifying how an optional argument should be printed
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int print_any2(va_list ap, char c)
{
	int bytes_written;
	char *ptc;

	bytes_written = 0;
	switch (c)
	{
		case 'c':
			write(1, c2s((va_arg(ap, int)), 0, 0), 1);
			bytes_written += 1;
			break;
		case 's':
			ptc = va_arg(ap, char *);
			write(1, ptc, _strlen(ptc));
			va_arg(ap, char *);
			bytes_written += _strlen(ptc);
			break;
		case '%':
			write(1, "%", 1);
			bytes_written += 1;
			break;
	}

	return (bytes_written);
}
