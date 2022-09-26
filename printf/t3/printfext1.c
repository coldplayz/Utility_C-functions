#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"

/**
 * printfext1 - produces output according to a
 * format. An extension of printfext2
 *  @ap: argument pointer recieved from _printf
 *  @c: character specifying format to print argument in.
 *
 *  Return: the number of characters printed,
 *  excluding the string-terminating null character
 */
int printfext1(va_list ap, char c)
{
	int bytes_written = 0;

	switch (c)
	{
		case 'c':
			bytes_written += printc(va_arg(ap, int));
			break;
		case '%':
			bytes_written += write(1, "%", 1);
			break;
		case 'b':
			bytes_written += printbin(va_arg(ap, unsigned int));
			break;
		case 'u':
			bytes_written += printu(va_arg(ap, unsigned int));
			break;
		case 'o':
			bytes_written += printo(va_arg(ap, unsigned int));
			break;
		case 'x':
			bytes_written += printx(va_arg(ap, unsigned int));
			break;
		case 'X':
			bytes_written += printX(va_arg(ap, unsigned int));
			break;
		case 'd':
		case 'i':
			bytes_written += printid(va_arg(ap, int));
			break;
		default:
			if (c == '!' || c == 'K')
			{
				bytes_written += write(1, "%", 1);
				bytes_written += write(1, c2s(c, 0, 0), 1);
			}
	}
	return (bytes_written);
}
